import cm from '@classmatejs/react'

const LayoutSize = {
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  full: 'full',
} as const
type LayoutSize = (typeof LayoutSize)[keyof typeof LayoutSize]

const layoutComponentSizeMapping = {
  xxs: 'max-w-[480px]',
  xs: 'max-w-[768px]',
  sm: 'max-w-[1000px]',
  md: 'max-w-[1480px]',
  lg: 'max-w-[1700px]',
  full: 'max-w-none',
} as const

interface LayoutComponentProps {
  $size?: LayoutSize
  $noPadding?: boolean
}

const LayoutComponent = cm.div.variants<LayoutComponentProps>({
  base: 'relative mx-auto w-full',
  variants: {
    $size: layoutComponentSizeMapping,
    $noPadding: {
      false: 'px-4',
    },
  },
  defaultVariants: {
    $size: LayoutSize.lg,
    $noPadding: false,
  },
})

export default LayoutComponent
