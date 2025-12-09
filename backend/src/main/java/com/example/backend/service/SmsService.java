package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    // Can be a phone number (+1...) or a Messaging Service SID (MG...)
    @Value("${twilio.fromNumber}")
    private String from;

    public void send(String to, String body) {
        String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String basicAuth = Base64.getEncoder()
                .encodeToString((accountSid + ":" + authToken).getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + basicAuth);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("To", to);

        if (from != null && from.startsWith("MG")) {
            // Using Messaging Service SID
            form.add("MessagingServiceSid", from);
        } else {
            // Using a Twilio phone number
            form.add("From", from);
        }

        form.add("Body", body);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("Twilio SMS failed: " + response.getStatusCode() + " " + response.getBody());
        }
    }
}