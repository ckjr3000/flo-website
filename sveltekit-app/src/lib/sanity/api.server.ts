import {env} from '$env/dynamic/private'
import {assertEnvVar} from '$lib/sanity/api'

export const token = assertEnvVar(env.SANITY_API_READ_TOKEN, 'SANITY_API_READ_TOKEN')