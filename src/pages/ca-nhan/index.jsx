import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Radio } from '@/components/Radio'
import { UploadFile } from '@/components/UploadFile'
import { avatarDefault } from '@/config/assets'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { fileService } from '@/services/file'
import { userService } from '@/services/user'
import { setUserAction } from '@/stores/auth'
import { confirm, handleError, minMax, object, regexp, required, validate } from '@/utils'
import { DatePicker, message } from 'antd'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'

const rules = {
    name: [required()],
    phone: [required(), regexp('phone')],
    currentPassword: [
        (_, forms) => {
            if (forms.newPassword) {
                const errorObj = validate({
                    currentPassword: [required(), minMax(6, 32)]
                }, forms)
                return errorObj.currentPassword
            }
        }
    ],
    newPassword: [
        (value, forms) => {
            if (forms.currentPassword) {
                if (forms.currentPassword === value) return "Vui lòng không điều giống mật khẩu cũ"
                const errorObj = validate({
                    newPassword: [required(), minMax(6, 32)]
                }, forms)
                return errorObj.newPassword
            }
        }
    ],
    confirmPassword: [
        confirm('newPassword')
    ]
}

export const ProfilePage = () => {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const userForm = useForm(rules, { initialValue: user })
    const fileRef = useRef()

    const { updateProfileLoading, refetch: updateProfileService } = useQuery({
        enabled: false,
        queryFn: ({ params }) => userService.updateProfile(...params)
    })

    const { loading: changePasswordLoading, refetch: changePasswordService } = useQuery({
        enabled: false,
        queryFn: ({ params }) => userService.changePassword(...params)
    })

    const onSubmit = async () => {
        const checkOldData = object.isEqual(user, userForm.values, 'username', 'name', 'phone', 'birthday', 'gender')

        let avatar
        if (fileRef.current) {
            const res = await fileService.uploadFile(fileRef.current)
            if (res.link) {
                avatar = res.link
            }
        }

        if (!avatar && !userForm.values.newPassword && checkOldData) {
            message.warning("Vui lòng nhập thông tin cần thay đổi")
            return
        }
        if (userForm.validate()) {
            if (avatar || !checkOldData) {
                updateProfileService({
                    ...userForm.values,
                    avatar
                }).then((res) => {
                    dispatch(setUserAction(res.data))
                    fileRef.current = null
                    message.success('Cập nhật thông tin tài khoản thành công')
                }).catch(handleError)
            }

            if (userForm.values.newPassword) {
                changePasswordService({
                    currentPassword: useForm.values.currentPassword,
                    newPassword: useForm.values.newPassword
                }).then(() => {
                    useForm.setValues({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    })
                    message.success('Thay đổi mật khẩu thành công')
                }).catch(handleError)
            }
        }
    }
    return (
        <div>
            <Helmet>
                <title>Cá nhân</title>
            </Helmet>
            <div className="row">
                <div className="col-12">
                    <UploadFile onChange={(file) => fileRef.current = file}>
                        {
                            (PreviewSrc, trigger) => (
                                <div className="profile-avatar">
                                    <div className="wrap" onClick={trigger}>
                                        <img src={PreviewSrc || user.avatar || avatarDefault} />
                                        <i className="icon">
                                            <img src="/img/icons/icon-camera.svg" />
                                        </i>
                                    </div>
                                </div>
                            )
                        }
                    </UploadFile>
                </div>
                <div className="col-12">
                    {/* Email */}
                    <Field
                        label="Full Name *"
                        placeholder='Full Name *'
                        {...userForm.register('name')}
                    />
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Field
                        label="Phone Number *"
                        placeholder='Phone Number *'
                        {...userForm.register('phone')}
                    />
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Field
                        label="Email Address *"
                        placeholder='Email Address *'
                        {...userForm.register('username')}
                        disabled
                    />
                </div>
                <div className="col-12 col-md-12">
                    {/* Password */}
                    <Field
                        label="Current Password"
                        placeholder='Current Password'
                        {...userForm.register('currentPassword')}
                        text='password'
                        autoComplete="new-password"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field
                        label="New Password"
                        placeholder='New Password'
                        {...userForm.register('newPassword')}
                        text='password'
                        autoComplete="new-password"
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field
                        label="Confirm Password"
                        placeholder='Confirm Password'
                        {...userForm.register('confirmPassword')}
                        text='password'
                        autoComplete="new-password"
                    />
                </div>
                <div className="col-12 col-lg-6">
                    <Field
                        label="Date of Birth"
                        {...userForm.register('birthday')}
                        renderField={(props) => <DatePicker format="DD/MM/YYYY" value={props.value ? dayjs(props.value) : undefined} onChange={(ev, date) => props.onChange(date)} className="form-control form-control-sm" />}
                    />
                </div>
                <div className="col-12 col-lg-6">
                    {/* Gender */}
                    <Field
                        label="Gender"
                        {...userForm.register('gender')}
                        renderField={props =>
                            <div className='btn-group-toggle'>
                                <Radio.Group defaultValue={props.value} onChange={value => props?.onChange?.(value)}>
                                    <Radio.Toggle value="male">Male</Radio.Toggle>
                                    <Radio.Toggle value="female">Female</Radio.Toggle>
                                </Radio.Group>
                            </div>}
                    />
                </div>
                <div className="col-12">
                    {/* Button */}
                    <Button onClick={onSubmit} loading={updateProfileLoading || changePasswordLoading}>Save Changes</Button>
                </div>
            </div>
        </div>
    )
}
