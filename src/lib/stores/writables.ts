import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

export const currentUser = writable({ uuid: null, role: null, data: null })
export const currentRegister = writable()
export const currentCourse: Writable<string> = writable()

export const users = writable({})
export const schools = writable()
export const courses = writable([])
export const lessons = writable([])
export const registers = writable()
export const students = writable()
export const toasts = writable([])