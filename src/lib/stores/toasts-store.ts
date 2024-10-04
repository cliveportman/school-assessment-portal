import { toasts } from './writables'

export const ToastServices = {

  removeToast: (index) => {
    toasts.subscribe
    toasts.update(currentToasts => {
      currentToasts.splice(index, 1)
      const updatedToasts = currentToasts
      return updatedToasts
    })    
  },

  addToast: (status = '', title = null, body = '') => {
    
    const newToast = { status: status, title: title, body: body }
    toasts.update(currentToasts => {      
      const updatedToasts = [ ...currentToasts, newToast ]
      return updatedToasts
    })  

  }

}