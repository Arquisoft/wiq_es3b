package io.gatling.demo;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class RecordedSimulation extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://172.187.224.137:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 OPR/98.0.0.0 (Edition beta)");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
    Map.entry("If-None-Match", "\"cec257ee15bfea06676a9a4d3bdadeca07dfde71\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("Upgrade-Insecure-Requests", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("If-None-Match", "\"0fa8b2182e46548e1b5ec64d9ef55e9961fb505f\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "text/css,*/*;q=0.1"),
    Map.entry("If-None-Match", "\"7bded3fa6d2bd112e6a65ac6f741a033a1d51bdf\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "\"8dda18c6640f3c046a874ad7979003de7b64bf96\""),
    Map.entry("Range", "bytes=0-"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "\"7795edf2e4b8a8138784a7ca82cdd6f1fb84acf4\""),
    Map.entry("Range", "bytes=0-"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "\"1b5fd39583604d7b553071b46243edf904b2bac7\""),
    Map.entry("Range", "bytes=0-"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,*/*"),
    Map.entry("If-None-Match", "\"28426a68efddb599d9370185db24fd122b052ad9\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,*/*"),
    Map.entry("If-None-Match", "\"782c2b3ead8023302c125060adfafa3191cdb481\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_10 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,*/*"),
    Map.entry("If-None-Match", "\"a8307a43fa10f84419be74f853b000d1ddd4222e\""),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "authorization"),
    Map.entry("Access-Control-Request-Method", "GET"),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_12 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"61-sw1+lelq0kXJMKosfJ0JOkzZsls\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_13 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"92-lW3QuTyisUDw9WjoxcL7/a5RQ2E\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"7c-LRqk7VAi0QVrF/X0usBFRg+ZBLM\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_16 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"8f-WPC7HkPM0nBlgDjMRrtokYXzMJ0\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_17 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"87-qAlzxNBmikH+6Xa03lpQurHdwBw\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_18 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"89-jlid/9a/gK6Cb1k9mqo1i69FSJA\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_20 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"b5-YmsNhsXJxcvJuX3pqH0kwVQGcns\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_21 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"9a-nHbhHi7npPl0iwtYJuHx/Scs1TM\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_22 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"cb-YYH3weHoh0oRzxUGxfx5+G/ETZU\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_23 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"8b-biFZLYSJA6/XhSXh+NsXL+JCkqo\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_25 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"a2-9cCO7jk2aZpA3gvTSJFIGIRouXg\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_26 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "authorization,content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_27 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjJjZjdiZjlmNzQ2ZjEwMjJmMzhjZmUiLCJpYXQiOjE3MTQyMjM1MzcsImV4cCI6MTcxNDIyNzEzN30.ISCv6UhMlLHXD9B0Nx6W8XOIJ9AaxJF0DAsjKioIwFM"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private Map<CharSequence, String> headers_28 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"52-f7mOKEMLM9ENLGkhkVZHme9Mq6s\""),
    Map.entry("Origin", "http://172.187.224.137:3000"),
    Map.entry("Sec-GPC", "1"),
    Map.entry("sec-ch-ua", "\"Opera\";v=\"98\", \"Chromium\";v=\"98\", \"Not=A?Brand\";v=\"24\""),
    Map.entry("sec-ch-ua-mobile", "?0"),
    Map.entry("sec-ch-ua-platform", "\"Windows\"")
  );
  
  private String uri1 = "172.187.224.137";

  private ScenarioBuilder scn = scenario("RecordedSimulation")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/main.f01ac9e0.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/static/css/main.64ccfb44.css")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/static/media/incorrect.6efd15fd4798e443d86c.mp3")
            .headers(headers_3),
          http("request_4")
            .get("http://" + uri1 + ":3000/static/media/correct.8b05e88a254f23e66783.mp3")
            .headers(headers_4),
          http("request_5")
            .get("http://" + uri1 + ":3000/static/media/activate.0f094026b04706c71ed2.mp3")
            .headers(headers_5)
        ),
      pause(9),
      http("request_6")
        .options("/login")
        .headers(headers_6)
        .resources(
          http("request_7")
            .post("/login")
            .headers(headers_7)
            .body(RawFileBody("io/gatling/demo/recordedsimulation/0007_request.json")),
          http("request_8")
            .get("http://" + uri1 + ":3000/static/media/icon.d10a3e03f5be925bfebf.png")
            .headers(headers_8),
          http("request_9")
            .get("http://" + uri1 + ":3000/static/media/perfil3.999058a8252b105bef55.jpg")
            .headers(headers_9)
        ),
      pause(2),
      http("request_10")
        .get("http://" + uri1 + ":3000/static/media/sonidoON.abf775617a63c8d08cbe.png")
        .headers(headers_10)
        .resources(
          http("request_11")
            .options("/api/questions/create?category=general&lang=en")
            .headers(headers_11),
          http("request_12")
            .get("/api/questions/create?category=general&lang=en")
            .headers(headers_12)
        ),
      pause(1),
      http("request_13")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_13),
      pause(1),
      http("request_14")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_14),
      pause(1),
      http("request_15")
        .options("/api/questions/create?category=general&lang=en")
        .headers(headers_11)
        .resources(
          http("request_16")
            .get("/api/questions/create?category=general&lang=en")
            .headers(headers_16)
        ),
      pause(1),
      http("request_17")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_17),
      pause(1),
      http("request_18")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_18),
      pause(1),
      http("request_19")
        .options("/api/questions/create?category=general&lang=en")
        .headers(headers_11)
        .resources(
          http("request_20")
            .get("/api/questions/create?category=general&lang=en")
            .headers(headers_20)
        ),
      pause(1),
      http("request_21")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_21),
      pause(1),
      http("request_22")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_22),
      pause(1),
      http("request_23")
        .get("/api/questions/create?category=general&lang=en")
        .headers(headers_23),
      pause(2),
      http("request_24")
        .options("/api/questions/create?category=general&lang=en")
        .headers(headers_11)
        .resources(
          http("request_25")
            .get("/api/questions/create?category=general&lang=en")
            .headers(headers_25),
          http("request_26")
            .options("/addgame")
            .headers(headers_26),
          http("request_27")
            .post("/addgame")
            .headers(headers_27)
            .body(RawFileBody("io/gatling/demo/recordedsimulation/0027_request.json"))
        ),
      pause(4),
      http("request_28")
        .get("/getParticipation/662cf7bf9f746f1022f38cfe")
        .headers(headers_28)
    );

  {
	  setUp(
	  	scn.injectOpen(
	  		rampUsersPerSec(10).to(20).during(20).randomized(),
	  		constantUsersPerSec(2).during(60).randomized(),
	  		rampUsersPerSec(10).to(20).during(20).randomized(),
	  		constantUsersPerSec(2).during(60).randomized()
	  	)
	  ).protocols(httpProtocol);
  }
}
