import type { I18nFieldValue } from '@/types/i18n';

export const MARKETING_PREFIXES: I18nFieldValue = {
	ko_kr: '(광고) ',
	en_us: '(광고) ',
	ja_jp: '(広告) ',
	ru_ru: '(Реклама) ',
	es_es: '(Publicidad) ',
	zh_cn: '(广告) ',
	zh_tw: '(廣告) ',
};
export const UNSUBSCRIBE_TEXTS: I18nFieldValue = {
	ko_kr: '무료 수신거부: 프로필 > 설정 > 알림에서 마케팅 알림 Off',
	en_us: 'Unsubscribe for free: Profile > Settings > Notifications > turn off Marketing alerts',
	ja_jp: '無料配信停止: プロフィール > 設定 > 通知でマーケティング通知をオフ',
	ru_ru: 'Бесплатная отписка: Профиль > Настройки > Уведомления > отключите маркетинг',
	es_es: 'Baja gratuita: Perfil > Ajustes > Notificaciones > desactiva las de marketing',
	zh_cn: '免费退订: 我的 > 设置 > 通知 > 关闭营销通知',
	zh_tw: '免費取消訂閱: 個人檔案 > 設定 > 通知 > 關閉行銷通知',
};

export const AUDIENCE_HELP_TEXTS = {
	announcement: '공지 알림을 끈 사용자는 제외',
	urgent: '알림 설정과 관계없이 모든 사용자에게 발송',
	marketing: '마케팅 알림을 켠 사용자에게만 발송, 21시부터 8시까지는 야간 수신에 동의한 기기에만 푸시 발송',
};
