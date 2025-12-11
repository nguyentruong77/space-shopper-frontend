import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Input } from '@/components/Input'
import { Radio } from '@/components/Radio'
import { Select } from '@/components/Select'
import { PATH } from '@/config'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError, object, required } from '@/utils'
import { message, Spin } from 'antd'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

const rules = {
    cardName: [required()],
    cardNumber: [required()],
    month: [required()],
    year: [required()],
    cvv: [required()],
    // default: [required()],
    // type: [required()],
}
export const ActionPaymentPage = () => {
    const { id } = useParams()
    const form = useForm(rules)
    const [step, setStep] = useState(id ? 1 : 0)
    const typeRef = useRef('card')
    const navigate = useNavigate()

    const { data: paymentDetail, loading: getPaymentLoading } = useQuery({
        enabled: !!id,
        queryFn: () => userService.getPaymentDetail(id),
        onSuccess: (res) => {
            const t = res.data.expired.split('/')
            const month = t[0]
            const year = t[1]
            form.setValues({
                ...res.data,
                month, year,
            })
        },
        onError: (err) => {
            message.error('Sổ thanh toán không tồn tại')
            navigate(PATH.Profile.Payment)
        }
    })

    const { loading, refetch: actionService } = useQuery({
        enabled: false,
        queryFn: ({ prams }) => {
            if (id) {
                return userService.editPayment(id, ...prams)
            } else {
                return userService.editPayment(...prams)
            }
        }
    })
    const onSubmit = async () => {
        try {
            if (form.validate()) {
                if (id && object.isEqual(form.values, paymentDetail.data)) {
                    message.warning('Vui lòng thay đổi dữ liệu trước khi cập nhật')
                    return
                }
                await actionService({
                    ...form.values,
                    expired: `${form.values.month}/${form.values.year}`,
                    type: typeRef.current,
                })
                message.success(id ? 'Cập nhật thanh toán thành công' : 'Thêm sổ thanh toán thành công')
                navigate(PATH.Profile.Payment)
            }
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <>
            <Helmet>
                <title>{id ? "Chỉnh sửa phương thức thanh toán" : "Thêm phương thức thanh toán"}</title>
            </Helmet>
            {
                step === 0 &&
                <div>
                    <Radio.Group defaultValue="card" onChange={(value) => typeRef.current = value}>
                        {/* Card */}
                        <div className="form-group card card-sm border">
                            <div className="card-body">
                                <Radio value="card">
                                    I want to add Debit / Credit Card <img className="ml-2" src="/img/brands/color/cards.svg" alt="..." />
                                </Radio>
                            </div>
                        </div>
                        {/* Card */}
                        <div className="form-group card card-sm border">
                            <div className="card-body">
                                <Radio value="paypal">
                                    I want to add PayPal <img src="/img/brands/color/paypal.svg" alt="..." />
                                </Radio>
                            </div>
                        </div>
                    </Radio.Group>
                    {/* Button */}
                    <button onClick={() => setStep(1)} className="btn btn-dark">
                        Continue <i className="fe fe-arrow-right ml-2" />
                    </button>
                </div>
            }
            {
                step === 1 &&
                <Spin spinning={getPaymentLoading}>
                    <div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <Field
                                    label="Card Number *"
                                    placeholder="Card Number"
                                    {...form.register("cardNumber")}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <Field
                                    label="Name on Card *"
                                    placeholder="Name on Card"
                                    {...form.register("cardName")}
                                />
                            </div>
                            <div className="col-12">
                                {/* Label */}
                                <label>
                                    Expiry Date *
                                </label>
                            </div>
                            <div className="col-12 col-md-4">
                                <Field
                                    {...form.register('month')}
                                    renderField={(props) =>
                                        <Select {...props}>
                                            <option>Month *</option>
                                            {
                                                Array.from(Array(12)).map((_, i) => <option key={i} value={i + 1}>{moment(`${i + 1}/01/2000`).format('MMMM')}</option>)
                                            }
                                        </Select>
                                    }
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <Field
                                    {...form.register('year')}
                                    renderField={(props) =>
                                        <Select {...props}>
                                            <option>Year *</option>
                                            {
                                                Array.from(Array(30)).map((_, i) => {
                                                    const value = ((new Date()).getFullYear() - 15 + i)
                                                    return <option value={value} key={value}>{value}</option>
                                                })
                                            }
                                        </Select>
                                    }
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <Field
                                    placeholder="CVV*"
                                    {...form.register("cvv")}
                                    renderField={props => <Input helper="The CVV Number on your credit card or debit card is a 3 digit number on VISA, MasterCard and Discover branded credit and debit cards." {...props} />}
                                />
                            </div>
                            <div className="col-12">
                                <Field
                                    {...form.register('default')}
                                    renderField={props =>
                                        <div className="custom-control custom-checkbox mb-3">
                                            <input onChange={(ev) => {
                                                if (paymentDetail && paymentDetail.data.default) {
                                                    message.warning('Bạn không thể bỏ thanh toán mặc định')
                                                } else {
                                                    props?.onChange?.(ev.target.checked)
                                                }
                                            }} checked={props.value} type="checkbox" className="custom-control-input" id="defaultPaymentMethod" />
                                            <label className="custom-control-label" htmlFor="defaultPaymentMethod">Default payment method</label>
                                        </div>}
                                />
                            </div>
                        </div>
                        {/* Button */}
                        <Button loading={loading} onClick={onSubmit} className="btn btn-dark" type="submit">
                            {
                                id ? "Edit card" : "Add Card"
                            }
                        </Button>
                    </div>
                </Spin>
            }
        </>
    )
}
