import random
import time
import uuid

from yt_dlp.extractor.tiktok import DouyinIE as _DouyinIE
from yt_dlp.utils import ExtractorError
from yt_dlp.utils.traversal import traverse_obj

from .douyin_signatures import generate_abogus
from .douyin_web_cookies import ensure_douyin_web_cookies

_DOUYIN_WEB_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)

_DOUYIN_APP_UA = (
    "com.ss.android.ugc.aweme/290100 "
    "(Linux; U; Android 12; zh_CN; Pixel 6; Build/SQ1A.220105.002; "
    "Cronet/TTNetVersion:b87d87a1 2024-08-23 QuicVersion:47946d2a 2020-10-14)"
)

_MOBILE_API_HOSTS = [
    "api3-normal-c-lq.amemv.com",
    "api5-normal-c-lq.amemv.com",
    "api3-normal-c-hl.amemv.com",
]


def _build_web_params(video_id):
    return {
        "device_platform": "webapp",
        "aid": "6383",
        "channel": "channel_pc_web",
        "pc_client_type": "1",
        "version_code": "290100",
        "version_name": "29.1.0",
        "cookie_enabled": "true",
        "screen_width": "1920",
        "screen_height": "1080",
        "browser_language": "zh-CN",
        "browser_platform": "Win32",
        "browser_name": "Chrome",
        "browser_version": "131.0.0.0",
        "browser_online": "true",
        "engine_name": "Blink",
        "engine_version": "131.0.0.0",
        "os_name": "Windows",
        "os_version": "10",
        "cpu_core_num": "12",
        "device_memory": "8",
        "platform": "PC",
        "downlink": "10",
        "effective_type": "4g",
        "round_trip_time": "0",
        "update_version_code": "170400",
        "msToken": "",
        "aweme_id": video_id,
    }


def _build_mobile_params(video_id):
    device_id = str(random.randint(7250000000000000000, 7325099899999994577))
    return {
        "aweme_id": video_id,
        "device_platform": "android",
        "os": "android",
        "ssmix": "a",
        "_rticket": str(int(time.time() * 1000)),
        "cdid": str(uuid.uuid4()),
        "channel": "googleplay",
        "aid": "1128",
        "app_name": "aweme",
        "version_code": "290100",
        "version_name": "29.1.0",
        "manifest_version_code": "290100",
        "update_version_code": "290100",
        "ab_version": "29.1.0",
        "resolution": "1080*2400",
        "dpi": "420",
        "device_type": "Pixel 6",
        "device_brand": "google",
        "language": "zh",
        "os_api": "31",
        "os_version": "12",
        "ac": "wifi",
        "is_pad": "0",
        "current_region": "CN",
        "app_type": "normal",
        "sys_region": "CN",
        "last_install_time": str(int(time.time()) - random.randint(86400, 1123200)),
        "timezone_name": "Asia/Shanghai",
        "residence": "CN",
        "app_language": "zh",
        "timezone_offset": "28800",
        "host_abi": "armeabi-v7a",
        "locale": "zh",
        "ac2": "wifi5g",
        "uoo": "1",
        "carrier_region": "CN",
        "op_region": "CN",
        "build_number": "29.1.0",
        "region": "CN",
        "ts": str(int(time.time())),
        "device_id": device_id,
        "openudid": "".join(random.choices("0123456789abcdef", k=16)),
    }


def _fetch_web_detail(ie, video_id, params):
    signed_params = dict(params)
    signed_params["a_bogus"] = generate_abogus(dict(params), user_agent=_DOUYIN_WEB_UA)
    return traverse_obj(
        ie._download_json(
            "https://www.douyin.com/aweme/v1/web/aweme/detail/",
            video_id,
            "Downloading Douyin web detail JSON",
            "Failed to download Douyin web detail JSON",
            query=signed_params,
            headers={
                "User-Agent": _DOUYIN_WEB_UA,
                "Referer": "https://www.douyin.com/",
            },
            fatal=False,
        ),
        ("aweme_detail", {dict}),
    )


def _fetch_mobile_detail(ie, video_id, params, api_host):
    odin_tt = "".join(random.choices("0123456789abcdef", k=160))
    ie._set_cookie(api_host, "odin_tt", odin_tt)

    return traverse_obj(
        ie._download_json(
            f"https://{api_host}/aweme/v1/aweme/detail/",
            video_id,
            f"Downloading mobile detail ({api_host})",
            f"Failed ({api_host})",
            query=params,
            headers={
                "User-Agent": _DOUYIN_APP_UA,
                "Accept": "application/json",
            },
            fatal=False,
        ),
        ("aweme_detail", {dict}),
    )


class DouyinIE(_DouyinIE):
    _VALID_URL = r"https?://(?:www\.)?douyin\.com/video/(?P<id>[0-9]+)"

    def _real_extract(self, url):
        video_id = self._match_id(url)

        for api_host in _MOBILE_API_HOSTS:
            mobile_params = _build_mobile_params(video_id)
            detail = _fetch_mobile_detail(self, video_id, mobile_params, api_host)
            if detail:
                self.to_screen(f"Got video via mobile API ({api_host})")
                return self._parse_aweme_video_app(detail)

        web_params = _build_web_params(video_id)
        detail = _fetch_web_detail(self, video_id, web_params)

        if not detail:
            ensure_douyin_web_cookies(self, video_id, _DOUYIN_WEB_UA)
            detail = _fetch_web_detail(self, video_id, web_params)

        if not detail:
            raise ExtractorError(
                "Unable to download Douyin video. Douyin is geo-restricted to China. "
                "If you are outside China, you may need a China proxy to access this content.",
                expected=True,
            )

        return self._parse_aweme_video_app(detail)
