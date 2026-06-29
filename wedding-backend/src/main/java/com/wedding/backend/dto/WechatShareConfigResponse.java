package com.wedding.backend.dto;

public record WechatShareConfigResponse(
        String appId,
        long timestamp,
        String nonceStr,
        String signature,
        String title,
        String description,
        String link,
        String imageUrl
) {
}
