from yt_dlp.extractor.tiktok import DouyinIE as _DouyinIE
from yt_dlp.utils import ExtractorError
from yt_dlp.utils.traversal import traverse_obj

from .douyin_signatures import generate_abogus
from .douyin_web_cookies import ensure_douyin_web_cookies

_DOUYIN_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0"
)


def _build_douyin_params(video_id):
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
        "browser_version": "130.0.0.0",
        "browser_online": "true",
        "engine_name": "Blink",
        "engine_version": "130.0.0.0",
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


def _fetch_aweme_detail(ie, video_id, params):
    signed_params = dict(params)
    signed_params["a_bogus"] = generate_abogus(dict(params), user_agent=_DOUYIN_UA)
    return traverse_obj(
        ie._download_json(
            "https://www.douyin.com/aweme/v1/web/aweme/detail/",
            video_id,
            "Downloading Douyin web detail JSON",
            "Failed to download Douyin web detail JSON",
            query=signed_params,
            headers={
                "User-Agent": _DOUYIN_UA,
                "Referer": "https://www.douyin.com/",
            },
            fatal=False,
        ),
        ("aweme_detail", {dict}),
    )


class DouyinIE(_DouyinIE):
    _VALID_URL = r"https?://(?:www\.)?douyin\.com/video/(?P<id>[0-9]+)"

    def _real_extract(self, url):
        video_id = self._match_id(url)
        params = _build_douyin_params(video_id)

        detail = _fetch_aweme_detail(self, video_id, params)

        if not detail:
            ensure_douyin_web_cookies(self, video_id, _DOUYIN_UA)
            detail = _fetch_aweme_detail(self, video_id, params)

        if not detail:
            raise ExtractorError(
                "Fresh cookies (not necessarily logged in) are needed",
                expected=not self._get_cookies("https://www.douyin.com/").get(
                    "s_v_web_id"
                ),
            )

        return self._parse_aweme_video_app(detail)
