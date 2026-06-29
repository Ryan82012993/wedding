package com.wedding.backend.controller;

import com.wedding.backend.dto.WechatShareConfigResponse;
import com.wedding.backend.service.WechatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wechat")
public class WechatController {

    private final WechatService wechatService;

    public WechatController(WechatService wechatService) {
        this.wechatService = wechatService;
    }

    @GetMapping("/share-config")
    public WechatShareConfigResponse getShareConfig(@RequestParam("url") String url) {
        return wechatService.buildShareConfig(url);
    }
}
