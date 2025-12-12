import { useState } from 'react'
import { Button } from '../Button'
import { ShortContentStyle } from './style'

export const ShortContent = ({ children, className, ...props }) => {
    const [isShorted, setIsShorted] = useState(true)
    return (
        <ShortContentStyle className={className}>
            <div {...props} style={{ height: isShorted ? 300 : 'auto' }} className='content'>
                {children}
            </div>
            <div className="read-more pt-10">
                <Button outline onClick={() => setIsShorted(!isShorted)} className="min-w-[300px] btn-xs">{isShorted ? 'Mở rộng' : 'Thu gọn'}</Button>
            </div>
        </ShortContentStyle>
    )
}
