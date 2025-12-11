import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { PATH } from '@/config'
import { useBodyClass } from '@/hooks/useBodyClass'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { getUserAction } from '@/stores/auth'
import { getCartAction } from '@/stores/cart'
import { confirm, handleError, required, setToken } from '@/utils'
import { message } from 'antd'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const rules = {
    password: [required()],
    confirmPassword: [required(), confirm('password')],
}

export const ResetPasswordPage = () => {
    useBodyClass('bg-light')
    const [search] = useSearchParams()
    const navigate = useNavigate()
    const code = search.get('code')
    const dispatch = useDispatch()
    useEffect(() => {
        if (!code) {
            navigate(PATH.Account)
        }
    }, [])
    const form = useForm(rules)
    const { loading, refetch: changePasswordService } = useQuery({
        enabled: false,
        queryFn: () => userService.changePasswordByCode({
            password: form.values.password,
            code,
        })
    })
    const onSubmit = async () => {
        try {
            if (form.validate()) {
                const res = await changePasswordService()
                message.success("Thay đổi mật khẩu thành công")
                setToken(res.data)
                dispatch(getUserAction())
                dispatch(getCartAction())
            }
        } catch (error) {
            handleError(error)
        }
    }
    return (
        <section className="py-12" >
            <Helmet>
                <title>Reset password</title>
            </Helmet>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 offset-md-3">
                        {/* Card */}
                        <div className="card card-lg mb-10 mb-md-0">
                            <div className="card-body">
                                {/* Heading */}
                                <h6 className="mb-7">Reset Password</h6>
                                {/* Form */}
                                <div className="row">
                                    <div className="col-12">
                                        <Field
                                            label="Password *"
                                            type='password'
                                            placeholder="Password *"
                                            {...form.register('password')}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <Field
                                            label="Confirm Password *"
                                            type='password'
                                            placeholder="Confirm Password *"
                                            {...form.register('confirmPassword')}
                                        />
                                    </div>
                                    <div className="col-12 col-md">
                                    </div>
                                    <div className="col-12">
                                        {/* Button */}
                                        <Button loading={loading} onClick={onSubmit}>
                                            Reset Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
