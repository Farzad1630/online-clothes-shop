// src/pages/Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// الگوی موبایل ایران: 09xxxxxxxxx یا +989xxxxxxxxx
const iranMobileRegex = /^(\+98|0)?9\d{9}$/;

const schema = yup.object().shape({
  phone: yup
    .string()
    .required('شماره تماس الزامی است')
    .test('is-valid-ir-mobile', 'شماره تماس نامعتبر است', (value = '') =>
      iranMobileRegex.test(value.replace(/\s|-/g, ''))
    ),
  password: yup
    .string()
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
    .required('رمز عبور الزامی است'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success('ورود با موفقیت انجام شد');
    reset();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h2 className="mb-4 text-end">ورود</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3 text-end">
          <label className="form-label d-block">شماره تماس</label>
          <input
            type="tel"
            inputMode="numeric"
            className="form-control text-end"
            {...register('phone')}
          />
          {errors.phone && <p className="text-danger mt-1">{errors.phone.message}</p>}
        </div>

        <div className="mb-3 text-end">
          <label className="form-label d-block">رمز عبور</label>
          <input
            type="password"
            className="form-control text-end"
            {...register('password')}
          />
          {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary">ورود</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
