import { PATH } from '@/config'
import { useAction } from '@/hooks/useAction'
import { userService } from '@/services/user'
import { withListLoading } from '@/utils/withListLoading'
import moment from 'moment'
import { generatePath, Link } from 'react-router-dom'
import { Button } from '../Button'
import { Skeleton } from '../Skeleton'
import { PaymentCardStyle } from './PaymentCardStyle'

const PaymentCardLoading = () => {
    return (
        <div className="col-12">
            {/* Card */}
            <div className="payment-card card card-lg bg-light mb-8" style={{ height: 224 }}>
                <div className="card-body">
                    {/* Heading */}
                    <h6 className="mb-6">
                        <Skeleton height={24} />
                    </h6>
                    {/* Text */}
                    <p className="mb-5">
                        <Skeleton height={22} />
                    </p>
                    {/* Text */}
                    <p className="mb-5">
                        <Skeleton height={22} />
                    </p>
                    {/* Text */}
                    <p className="mb-0">
                        <Skeleton height={22} />
                    </p>
                </div>
            </div>
        </div>
    )
}

export const PaymentCard = ({ onChangePaymentDefault, onDeletePayment, _id, type, cardName, cardNumber, expired, default: paymentDefault }) => {
    const t = expired.split('/')
    const month = t[0]
    const year = t[1]

    const _onChangePaymentDefault = useAction({
        service: () => userService.editPayment(_id, { default: true }),
        loadingMessage: "Thao tác đang được thực hiện",
        successMessage: "Thay đổi thanh toán mặc định thành công",
        onSuccess: () => onChangePaymentDefault?.()
    })

    const _onDeletePayment = useAction({
        service: () => userService.removePayment(_id),
        loadingMessage: "Đang xóa thanh toán",
        successMessage: "Xóa thanh toán thành công",
        onSuccess: () => onDeletePayment?.(),
    })

    return (
        <PaymentCardStyle className="col-12">
            {/* Card */}
            <div className="payment-card card card-lg bg-light mb-8">
                <div className="card-body">
                    {/* Heading */}
                    <h6 className="mb-6">
                        {
                            type === 'card' ? "Debit / Credit Card" : "Paypal"
                        }
                    </h6>
                    {/* Text */}
                    <p className="mb-5">
                        <strong>Card Number:</strong> <br />
                        <span className="text-muted">{cardNumber}</span>
                    </p>
                    {/* Text */}
                    <p className="mb-5">
                        <strong>Expiry Date:</strong> <br />
                        <span className="text-muted">{moment(`${month}/01/${year}`).format('MMM, YYYY')}</span>
                    </p>
                    {/* Text */}
                    <p className="mb-0">
                        <strong>Name on Card:</strong> <br />
                        <span className="text-muted">{cardName}</span>
                    </p>
                    <div className="card-action-right-bottom">
                        {
                            paymentDefault ?
                                <div className="color-success cursor-pointer">
                                    Thanh toán mặc định
                                </div> :
                                <Button onClick={_onChangePaymentDefault} outline className="hidden btn-change-default btn-xs">
                                    Đặt làm thanh toán mặc định
                                </Button>
                        }
                    </div>
                    {/* Action */}
                    <div className="card-action card-action-right flex gap-2">
                        {/* Button */}
                        <Link className="btn btn-xs btn-circle btn-white-primary" to={generatePath(PATH.Profile.EditPayment, { id: _id })}>
                            <i className="fe fe-edit-2" />
                        </Link>
                        {
                            !paymentDefault && <button className="btn btn-xs btn-circle btn-white-primary" onClick={_onDeletePayment}>
                                <i className="fe fe-x" />
                            </button>
                        }
                    </div>
                </div>
            </div>
        </PaymentCardStyle>
    )
}

export const ListPaymentCard = withListLoading(PaymentCard, PaymentCardLoading)
