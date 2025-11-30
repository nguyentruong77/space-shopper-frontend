import { Popconfirm as PopconfirmM } from 'antd'
import React from 'react'
import { Button } from '../Button'

export const PopConfirm = ({ showCancel = true, description, ...props }) => {
    return (
        <PopconfirmM
            {...props}
            showCancel={false}
            okButtonProps={{ hidden: true }}
            description={
                <>
                    {description}
                    <div className='flex justify-end mt-2 gap-2'>
                        {
                            showCancel && <Button outline className="btn-xs" onClick={props.onCancel}>{props.cancelText || 'Cancel'}</Button>
                        }
                        <Button className="btn-xs" onClick={props.onConfirm}>{props.okText || 'Ok'}</Button>
                    </div>
                </>
            }
            footer={null}
        />
    )
}
