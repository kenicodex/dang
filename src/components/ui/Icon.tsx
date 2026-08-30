import { View } from 'react-native'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'

/**
 * SymbolView renders Apple SF Symbols on iOS but needs an explicit Material
 * Symbols name on Android/web — a plain SF Symbol string renders nothing
 * there. This maps every SF Symbol name used in the app to its verified
 * Material Symbols equivalent (checked against expo-symbols' bundled
 * symbols.json) so icons show up cross-platform without touching call sites.
 */
const ANDROID_ICON_MAP: Record<string, string> = {
  'alarm': 'alarm',
  'arrow.2.squarepath': 'repeat',
  'arrow.clockwise': 'refresh',
  'arrow.down': 'arrow_downward',
  'arrow.down.circle': 'arrow_circle_down',
  'arrow.down.left': 'south_west',
  'arrow.right': 'arrow_forward',
  'arrow.up.right': 'north_east',
  'arrow.uturn.left': 'undo',
  'at': 'alternate_email',
  'bag': 'shopping_bag',
  'bag.fill': 'shopping_bag',
  'bell': 'notifications_none',
  'bell.fill': 'notifications',
  'bell.slash': 'notifications_off',
  'bold': 'format_bold',
  'book': 'menu_book',
  'bookmark': 'bookmark_border',
  'bookmark.fill': 'bookmark',
  'bubble.left': 'chat_bubble_outline',
  'bubble.left.and.bubble.right.fill': 'forum',
  'bubble.left.fill': 'chat_bubble',
  'calendar': 'calendar_month',
  'calendar.badge.plus': 'calendar_add_on',
  'camera': 'photo_camera',
  'camera.fill': 'photo_camera',
  'chart.bar.fill': 'bar_chart',
  'checkmark': 'check',
  'checkmark.circle.fill': 'check_circle',
  'checkmark.seal.fill': 'verified',
  'chevron.down': 'keyboard_arrow_down',
  'chevron.left': 'chevron_left',
  'chevron.right': 'chevron_right',
  'chevron.up': 'keyboard_arrow_up',
  'circle': 'circle',
  'circle.grid.3x3': 'apps',
  'clock': 'schedule',
  'clock.arrow.circlepath': 'history',
  'cloud.fill': 'cloud',
  'creditcard': 'credit_card',
  'doc.on.doc': 'content_copy',
  'doc.text': 'description',
  'doc.text.fill': 'description',
  'dot.radiowaves.left.and.right': 'sensors',
  'drop.fill': 'water_drop',
  'ellipsis': 'more_horiz',
  'envelope': 'mail',
  'envelope.fill': 'mail',
  'exclamationmark.circle': 'error_outline',
  'exclamationmark.circle.fill': 'error',
  'eye': 'visibility',
  'face.smiling': 'sentiment_satisfied',
  'folder': 'folder',
  'folder.fill': 'folder',
  'gearshape': 'settings',
  'globe': 'public',
  'graduationcap': 'school',
  'graduationcap.fill': 'school',
  'hand.raised.slash': 'do_not_touch',
  'hand.thumbsdown': 'thumb_down',
  'hand.thumbsup': 'thumb_up',
  'hand.thumbsup.fill': 'thumb_up',
  'headphones': 'headphones',
  'heart': 'favorite_border',
  'heart.fill': 'favorite',
  'house': 'home',
  'house.fill': 'home_filled',
  'info.circle.fill': 'info',
  'iphone': 'smartphone',
  'italic': 'format_italic',
  'laptopcomputer': 'laptop_mac',
  'leaf.fill': 'eco',
  'link': 'link',
  'list.bullet': 'format_list_bulleted',
  'list.number': 'format_list_numbered',
  'lock': 'lock',
  'lock.fill': 'lock',
  'lock.shield.fill': 'security',
  'magnifyingglass': 'search',
  'mappin': 'location_on',
  'message': 'chat_bubble_outline',
  'message.fill': 'chat_bubble',
  'mic.fill': 'mic',
  'mic.slash.fill': 'mic_off',
  'multiply': 'close',
  'paperclip': 'attach_file',
  'paperplane': 'send',
  'paperplane.fill': 'send',
  'pause.fill': 'pause',
  'pencil': 'edit',
  'person': 'person',
  'person.2': 'group',
  'person.2.fill': 'group',
  'person.badge.plus': 'person_add',
  'person.crop.square': 'account_box',
  'person.fill': 'person',
  'phone': 'call',
  'phone.down.fill': 'call_end',
  'phone.fill': 'call',
  'photo': 'image',
  'photo.on.rectangle': 'photo_library',
  'pin.fill': 'push_pin',
  'play.circle': 'play_circle',
  'play.fill': 'play_arrow',
  'play.rectangle': 'video_library',
  'plus': 'add',
  'qrcode': 'qr_code',
  'receipt': 'receipt_long',
  'rectangle.portrait.and.arrow.right': 'logout',
  'rosette': 'military_tech',
  'seal': 'verified',
  'shield.fill': 'shield',
  'speaker.fill': 'volume_up',
  'speaker.wave.3.fill': 'volume_up',
  'square.and.arrow.up': 'ios_share',
  'square.and.pencil': 'edit_square',
  'square.grid.2x2': 'grid_view',
  'star': 'star_border',
  'star.fill': 'star',
  'strikethrough': 'format_strikethrough',
  'tag': 'sell',
  'testtube.2': 'science',
  'trash': 'delete',
  'underline': 'format_underlined',
  'video': 'videocam',
  'video.fill': 'videocam',
  'video.slash.fill': 'videocam_off',
  'waveform': 'graphic_eq',
  'xmark': 'close',
}

export type { SymbolViewProps }

/**
 * Cross-platform icon. Drop-in replacement for expo-symbols' `SymbolView`:
 * pass the same SF Symbol name and this resolves the matching Material
 * Symbols glyph for Android/web automatically. Any name without a verified
 * mapping still renders (a small neutral dot) instead of disappearing.
 */
export function Icon({ name, fallback, size = 24, tintColor, ...props }: SymbolViewProps) {
  const isPlainName = typeof name === 'string'
  const androidName = isPlainName ? ANDROID_ICON_MAP[name] : undefined

  const resolvedName =
    isPlainName && androidName
      ? ({ ios: name, android: androidName, web: androidName } as SymbolViewProps['name'])
      : name

  const resolvedFallback =
    fallback ??
    (isPlainName && !androidName ? (
      <View
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: (size * 0.4) / 2,
          backgroundColor: (tintColor as string) ?? '#9CA3AF',
        }}
      />
    ) : undefined)

  return (
    <SymbolView name={resolvedName} fallback={resolvedFallback} size={size} tintColor={tintColor} {...props} />
  )
}
