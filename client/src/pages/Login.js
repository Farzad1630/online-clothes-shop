// src/pages/Login.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  email: yup.string().email('ایمیل نامعتبر است').required('ایمیل الزامی است'),
  password: yup.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').required('رمز عبور الزامی است'),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
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
          <label className="form-label d-block">ایمیل</label>
          <input
            type="email"
            className="form-control text-end"
            {...register('email')}
          />
          {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
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
