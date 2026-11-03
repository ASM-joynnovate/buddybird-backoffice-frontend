import type { NotificationKind } from '@/types/apis/notifications';

import type { I18nFieldValue } from '@/types/i18n';

export const NOTIFICATION_KINDS = {
	report: { label: '리포트', color: 'var(--chart-1)' },
	announcement: { label: '공지', color: 'var(--chart-2)' },
	marketing: { label: '마케팅', color: 'var(--chart-3)' },
	urgent: { label: '긴급', color: 'var(--chart-4)' },
	emergency: { label: '응급', color: 'var(--destructive-dot)' },
} satisfies Record<NotificationKind, { label: string; color: string }>;

export const MARKETING_PREFIXES: I18nFieldValue = {
	ko_kr: '(광고) ',
	en_us: '(광고) ',
	ja_jp: '(広告) ',
	ru_ru: '(Реклама) ',
	es_es: '(Publicidad) ',
	th_th: '(โฆษณา) ',
	zh_hans: '(广告) ',
	zh_hant: '(廣告) ',
	vi_vn: '[QC] ',
	hi_in: '(विज्ञापन) ',
	bn_bd: '(বিজ্ঞাপন) ',
};
export const UNSUBSCRIBE_TEXTS: I18nFieldValue = {
	ko_kr: '무료 수신거부: 프로필 > 설정 > 알림에서 마케팅 알림 Off',
	en_us: 'Unsubscribe for free: Profile > Settings > Notifications > turn off Marketing alerts',
	ja_jp: '無料配信停止: プロフィール > 設定 > 通知でマーケティング通知をオフ',
	ru_ru: 'Бесплатная отписка: Профиль > Настройки > Уведомления > отключите маркетинг',
	es_es: 'Baja gratuita: Perfil > Ajustes > Notificaciones > desactiva las de marketing',
	th_th: 'ยกเลิกการรับข่าวสารได้ฟรี: โปรไฟล์ > การตั้งค่า > การแจ้งเตือน > ปิดการแจ้งเตือนข่าวสารและโปรโมชั่น',
	zh_hans: '免费退订: 我的 > 设置 > 通知 > 关闭营销通知',
	zh_hant: '免費取消訂閱: 個人檔案 > 設定 > 通知 > 關閉行銷通知',
	vi_vn: 'Từ chối nhận miễn phí: Hồ sơ > Cài đặt > Thông báo > tắt thông báo khuyến mãi',
	hi_in: 'मुफ़्त में अनसब्सक्राइब करें: प्रोफ़ाइल > सेटिंग > सूचनाएं > प्रमोशन सूचनाएं बंद करें',
	bn_bd: 'বিনামূল্যে আনসাবস্ক্রাইব: প্রোফাইল > সেটিংস > বিজ্ঞপ্তি > মার্কেটিং বিজ্ঞপ্তি বন্ধ করুন',
};

export const AUDIENCE_HELP_TEXTS = {
	announcement: '공지 알림을 끈 사용자는 제외',
	urgent: '알림 설정과 관계없이 모든 사용자에게 발송',
	marketing: '마케팅 알림을 켠 사용자에게만 발송, 21시부터 8시까지는 야간 수신에 동의한 기기에만 푸시 발송',
};
