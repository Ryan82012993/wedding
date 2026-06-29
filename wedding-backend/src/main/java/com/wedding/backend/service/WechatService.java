package com.wedding.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.WechatShareConfigResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class WechatService {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper;

    @Value("${wechat.app-id:}")
    private String appId;

    @Value("${wechat.app-secret:}")
    private String appSecret;

    @Value("${wechat.share-title:何建峰 & 周婉情答谢宴邀请函}")
    private String shareTitle;

    @Value("${wechat.share-description:诚邀您参加我们的婚礼答谢宴，点击查看详情并回复出席信息。}")
    private String shareDescription;

    @Value("${wechat.share-link:}")
    private String shareLink;

    @Value("${wechat.share-image-url:}")
    private String shareImageUrl;

    private volatile CachedValue accessTokenCache;
    private volatile CachedValue jsapiTicketCache;

    public WechatService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public WechatShareConfigResponse buildShareConfig(String pageUrl) {
        if (appId == null || appId.isBlank() || appSecret == null || appSecret.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_IMPLEMENTED,
                    "WeChat sharing is not configured. Please set wechat.app-id and wechat.app-secret."
            );
        }

        String normalizedUrl = normalizePageUrl(pageUrl);
        String nonceStr = UUID.randomUUID().toString().replace("-", "");
        long timestamp = Instant.now().getEpochSecond();
        String jsapiTicket = getJsapiTicket();
        String signature = sign(jsapiTicket, nonceStr, timestamp, normalizedUrl);

        return new WechatShareConfigResponse(
                appId,
                timestamp,
                nonceStr,
                signature,
                shareTitle,
                shareDescription,
                shareLink.isBlank() ? normalizedUrl : shareLink,
                shareImageUrl
        );
    }

    private String normalizePageUrl(String pageUrl) {
        if (pageUrl == null || pageUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing page URL.");
        }

        String normalizedUrl = pageUrl.split("#")[0];
        if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid page URL.");
        }
        return normalizedUrl;
    }

    private String getJsapiTicket() {
        CachedValue cached = jsapiTicketCache;
        if (cached != null && !cached.isExpired()) {
            return cached.value();
        }

        synchronized (this) {
            cached = jsapiTicketCache;
            if (cached != null && !cached.isExpired()) {
                return cached.value();
            }

            String accessToken = getAccessToken();
            String requestUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="
                    + urlEncode(accessToken)
                    + "&type=jsapi";
            JsonNode response = performGet(requestUrl);
            validateWechatResponse(response);

            String ticket = response.path("ticket").asText("");
            int expiresIn = response.path("expires_in").asInt(7200);
            if (ticket.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "WeChat jsapi_ticket response was empty.");
            }

            jsapiTicketCache = new CachedValue(ticket, Instant.now().plusSeconds(Math.max(60, expiresIn - 300)));
            return ticket;
        }
    }

    private String getAccessToken() {
        CachedValue cached = accessTokenCache;
        if (cached != null && !cached.isExpired()) {
            return cached.value();
        }

        synchronized (this) {
            cached = accessTokenCache;
            if (cached != null && !cached.isExpired()) {
                return cached.value();
            }

            String requestUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="
                    + urlEncode(appId)
                    + "&secret="
                    + urlEncode(appSecret);
            JsonNode response = performGet(requestUrl);
            validateWechatResponse(response);

            String accessToken = response.path("access_token").asText("");
            int expiresIn = response.path("expires_in").asInt(7200);
            if (accessToken.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "WeChat access_token response was empty.");
            }

            accessTokenCache = new CachedValue(accessToken, Instant.now().plusSeconds(Math.max(60, expiresIn - 300)));
            return accessToken;
        }
    }

    private JsonNode performGet(String url) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url)).GET().build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "WeChat API returned HTTP " + response.statusCode());
            }
            return objectMapper.readTree(response.body());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to call WeChat API.", e);
        }
    }

    private void validateWechatResponse(JsonNode response) {
        int errCode = response.path("errcode").asInt(0);
        if (errCode != 0) {
            String errMsg = response.path("errmsg").asText("unknown error");
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "WeChat API error " + errCode + ": " + errMsg
            );
        }
    }

    private String sign(String jsapiTicket, String nonceStr, long timestamp, String url) {
        String payload = "jsapi_ticket=" + jsapiTicket
                + "&noncestr=" + nonceStr
                + "&timestamp=" + timestamp
                + "&url=" + url;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            return HexFormat.of().formatHex(digest.digest(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 is not available.", e);
        }
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private record CachedValue(String value, Instant expiresAt) {
        private boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }
}
