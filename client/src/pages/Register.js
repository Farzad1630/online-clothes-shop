// src/pages/Register.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// 09xxxxxxxxx یا +989xxxxxxxxx
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
    .min(6, 'رمز باید حداقل 6 کاراکتر باشد')
    .required('رمز عبور الزامی است'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'تکرار رمز عبور باید با رمز عبور یکسان باشد')
    .required('تکرار رمز عبور الزامی است'),
});

function Register() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // نرمال‌سازی شماره (حذف فاصله/خط تیره)
    const normalized = {
      ...data,
      phone: data.phone.replace(/\s|-/g, ''),
    };
    console.log(normalized);
    toast.success('ثبت‌نام موفقیت‌آمیز بود!');
    reset();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h2 className="mb-4 text-end">ثبت‌نام</h2>
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
          <input type="password" className="form-control text-end" {...register('password')} />
          {errors.password && <p className="text-danger mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-3 text-end">
          <label className="form-label d-block">تکرار رمز عبور</label>
          <input type="password" className="form-control text-end" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-danger mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary">ثبت‌نام</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
