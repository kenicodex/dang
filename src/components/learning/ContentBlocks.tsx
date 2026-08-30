import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { ContentBlock } from './courseDetail.data'

interface ContentBlocksProps {
  blocks: ContentBlock[]
}

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <View style={styles.container}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <Text key={i} style={styles.heading}>
                {block.text}
              </Text>
            )
          case 'bold':
            return (
              <Text key={i} style={styles.bold}>
                {block.text}
              </Text>
            )
          case 'list':
            return (
              <View key={i} style={styles.list}>
                {block.items.map(item => (
                  <View key={item} style={styles.listRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )
          case 'paragraph':
          default:
            return (
              <Text key={i} style={styles.paragraph}>
                {block.text}
              </Text>
            )
        }
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 4,
  },
  bold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.light.textAlt,
  },
  list: {
    gap: 6,
  },
  listRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.light.textAlt,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.textAlt,
  },
})
