import { useCart } from '@/hooks/useCart'
import { removeCartItemAction, toggleItemCheckoutAction, updateCardItemAction } from '@/stores/cart'
import { cn, currency } from '@/utils'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { PopConfirm } from '../PopConfirm'
import { Checkbox } from '../checkout'

export const CartItem = ({ footer, hideAction, allowSelect, productId, product, quantity, ...props }) => {
    const dispatch = useDispatch()
    const [_quantity, setQuantity] = useState(quantity)
    const { loading, preCheckoutData: { listItems } } = useCart()
    const _loading = loading[productId] || false
    const [openPopConfirm, setOpenPopConfirm] = useState(false)
    const [openPopConfirmQuantity, setOpenPopConfirmQuantity] = useState(false)

    const selected = !!listItems.find(e => e === productId)

    useEffect(() => {
        if (_quantity !== quantity) {
            setQuantity(quantity)
        }
    }, [quantity])
    const onChangeQuantity = (val) => () => {
        if (val === 0) {
            dispatch(removeCartItemAction(productId))
        } else {
            setQuantity(val)
            dispatch(updateCardItemAction({
                productId,
                quantity: val,
            }))
        }
    }
    const onSelectCartItem = (checked) => {
        dispatch(toggleItemCheckoutAction({
            productId,
            checked,
        }))
    }
    return (
        <Spin spinning={_loading}>
            <li className={cn("list-group-item", props.className)}>
                <div className="row align-items-center">
                    {
                        allowSelect && <Checkbox checked={selected} onChange={onSelectCartItem} />
                    }
                    <div className="w-[120px]">
                        {/* Image */}
                        <a href="#">
                            <img className="img-fluid" src={product.thumbnail_url} alt="..." />
                        </a>
                    </div>
                    <div className="flex-1 px-2">
                        {/* Title */}
                        <p className="font-size-sm mb-6">
                            <a className="text-body" href="./product.html">{product.name}</a> <br />
                            <span className="card-product-price">
                                {
                                    product.real_price < product.price ?
                                        <>
                                            <span className="sale text-primary">{currency(product.real_price)}</span>
                                            <span className="text-muted line-through ml-1 inline-block">{currency(product.price)}</span>
                                        </> :
                                        <span className="text-muted line-through ml-1">{currency(product.real_price)}</span>
                                }
                            </span>
                        </p>
                        {/*Footer */}
                        {
                            !hideAction && <div className="d-flex align-items-center">
                                {/* Select */}
                                <div className="btn-group btn-quantity">
                                    <PopConfirm
                                        open={openPopConfirmQuantity}
                                        onOpenChange={visible => setOpenPopConfirmQuantity(visible)}
                                        disabled={_quantity > 1 ? true : false} showCancel={false} okText="Xóa"
                                        placement="bottomRight"
                                        title="Thông báo" description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                        onConfirm={() => {
                                            setOpenPopConfirmQuantity(false)
                                            onChangeQuantity(0)()
                                        }}>
                                        <button onClick={_quantity > 1 ? onChangeQuantity(_quantity - 1) : undefined} className="btn">-</button>
                                    </PopConfirm>
                                    <input onBlur={(ev) => {
                                        let val = parseInt(ev.target.value)
                                        if (!val) {
                                            val = 1
                                            setQuantity(val)
                                        }
                                        if (val !== quantity) {
                                            onChangeQuantity(val)
                                        }
                                    }} value={_quantity} onChange={ev => setQuantity(ev.target.value)} />
                                    <button onClick={onChangeQuantity(_quantity + 1)} className="btn">+</button>
                                </div>
                                {/* Remove */}
                                <PopConfirm
                                    open={openPopConfirm}
                                    onOpenChange={visible => setOpenPopConfirm(visible)}
                                    showCancel={false} okText="Xóa" placement="bottomRight"
                                    title="Thông báo" description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                    onConfirm={() => {
                                        setOpenPopConfirm(false)
                                        onChangeQuantity(0)()
                                    }}>
                                    <a onClick={(ev) => ev.preventDefault()} className="font-size-xs text-gray-400 ml-auto" href="#!">
                                        <i className="fe fe-x" /> Xóa
                                    </a>
                                </PopConfirm>
                            </div>
                        }
                        {footer}
                    </div>
                </div>
            </li>
        </Spin>
    )
}
