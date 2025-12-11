import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { PATH } from '@/config'
import { useForm } from '@/hooks/useForm'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError, object, regexp, required } from '@/utils'
import { message, Spin } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

const rules = {
  fullName: [
    required()
  ],
  phone: [
    required(),
    regexp('phone'),
  ],
  email: [
    required(),
    regexp('email'),
  ],
  province: [
    required()
  ],
  district: [
    required()
  ],
  address: [
    required()
  ],
}
export const ActionAddressPage = () => {
  const form = useForm(rules)
  const navigate = useNavigate()
  const { id } = useParams()

  const { data: addressDetail, loading: getAddressLoading } = useQuery({
    enabled: !!id,
    queryFn: () => userService.getAddressDetail(id),
    onSuccess: (res) => {
      form.setValues(res.data)
    },
    onError: (err) => {
      message.error('Sổ địa chỉ không tồn tại')
      navigate(PATH.Profile.Address)
    }
  })

  const { loading, refetch: actionService } = useQuery({
    enabled: false,
    queryFn: ({ prams }) => {
      if (id) {
        return userService.editAddress(id, ...prams)
      } else {
        return userService.addAddress(...prams)
      }
    }
  })
  const onSubmit = async () => {
    try {
      if (form.validate()) {
        if (id && object.isEqual(form.values, addressDetail.data)) {
          message.warning('Vui lòng thay đổi dữ liệu trước khi cập nhật')
          return
        }
        await actionService(form.values)
        message.success(id ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ thành công')
        navigate(PATH.Profile.Address)
      }
    } catch (error) {
      handleError(error)
    }
  }
  const isEdit = id
  return (
    <>
      <Helmet>
        <title>{isEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}</title>
      </Helmet>
      <Spin spinning={getAddressLoading}>
        <div className="row">
          <div className="col-12">
            <Field
              label="Full Name *"
              placeholder="First Name"
              {...form.register('fullName')}
            />
          </div>
          <div className="col-12 col-md-6">
            <Field
              label="Phone Number*"
              placeholder="Phone Number*"
              {...form.register('phone')}
            />
          </div>
          <div className="col-12 col-md-6">
            <Field
              label="Email Address *"
              placeholder="Email Address *"
              {...form.register('email')}
            />
          </div>
          <div className="col-12 col-md-6">
            <Field
              label="District *"
              placeholder="District *"
              {...form.register('district')}
            />
          </div>
          <div className="col-12 col-md-6">
            <Field
              label="Province / City *"
              placeholder="Province / City *"
              {...form.register('province')}
            />
          </div>
          <div className="col-12">
            <Field
              label="Address *"
              placeholder="Address *"
              {...form.register('address')}
            />
          </div>
          <div className="col-12">
            <Field
              {...form.register('default')}
              renderField={props =>
                <div className="custom-control custom-checkbox mb-0">
                  <input onChange={(ev) => {
                    if (addressDetail && addressDetail.data.default) {
                      message.warning('Bạn không thể bỏ địa chỉ mặc định')
                    } else {
                      props?.onChange?.(ev.target.checked)
                    }
                  }} checked={props.value} type="checkbox" className="custom-control-input" id="defaultShippingAddress" />
                  <label className="custom-control-label" htmlFor="defaultShippingAddress">Default shipping address</label>
                </div>}
            />
          </div>
        </div>
        {/* Button */}
        <Button loading={loading} onClick={onSubmit}>
          {
            isEdit ? "Cập nhật" : "Thêm mới"
          }
        </Button>
      </Spin>
    </>
  )
}
