import api from './axios'
export const sendMessage = async message => (await api.post('/chatbot/message', { message })).data
