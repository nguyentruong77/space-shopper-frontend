import { cn } from '@/utils'
import { SkeletonStyle } from './style'

export const Skeleton = ({ shape, width, height, children, ...props }) => {
    return (
        <SkeletonStyle className={cn(shape, props.className)} style={{ width, height }} {...props}>{children}</SkeletonStyle>
    )
}
