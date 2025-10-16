import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import categoryReducer from './slices/admin/categorySlice'
import productReducer from './slices/vendor/productSlice'
import profileReducer from './slices/profileSlice'
import vendorReducer from './slices/admin/vendorSlice'
import subcategoryReducer from './slices/admin/subcategorySlice'

const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  product: productReducer,
  categories: categoryReducer,
  subcategories: subcategoryReducer,
   vendors: vendorReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
