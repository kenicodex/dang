import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { FAQItem } from '@/types/support'

interface FAQAccordionItemProps {
  faq: FAQItem
  defaultOpen?: boolean
}

export function FAQAccordionItem({ faq, defaultOpen }: FAQAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(!!defaultOpen)

  return (
    <Pressable style={styles.card} onPress={() => setIsOpen(v => !v)}>
      <View style={styles.row}>
        <Text style={styles.question}>{faq.question}</Text>
        <Icon
          name={isOpen ? 'minus' : 'plus'}
          size={16}
          tintColor={colors.light.text}
        />
      </View>
      {isOpen && <Text style={styles.answer}>{faq.answer}</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textMuted,
    marginTop: 10,
  },
})
