// useful links for describing the parts that make up a URL:
// - https://nodejs.org/api/url.html#url_url_strings_and_url_objects
// - https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Examples
//
// node's url formatting algorithm (which acts pretty unexpectedly)
// - https://nodejs.org/api/url.html#url_url_format_urlobject

import _ from 'lodash'

// yup, protocol contains a: ':' colon
// at the end of it (-______________-)
const DEFAULT_PROTOCOL_PORTS = {
  'https:': '443',
  'http:': '80',
} as const

type Protocols = keyof typeof DEFAULT_PROTOCOL_PORTS

const DEFAULT_PORTS = _.values(DEFAULT_PROTOCOL_PORTS) as string[]

const FAKE_HOST = 'http://cy-fake-host/'

class RelativeUrl {
  public readonly hostname: string
  public readonly host: string
  public readonly href: string
  public readonly origin: string
  public readonly protocol: string
  public readonly pathname: string
  public readonly search: string

  constructor (url: URL) {
    this.href = url.href.replace(FAKE_HOST, '')
    this.pathname = url.pathname
    this.search = url.search
    this.hostname = ''
    this.host = ''
    this.origin = ''
    this.protocol = ''
    this.port = ''
  }

  set port (port) {
    if (port.length === 0) {
      return
    }

    throw new Error('RelativeUrl does not support setting port')
  }
}

const portIsDefault = (port: string) => {
  return DEFAULT_PORTS.includes(port)
}

export const parseUrl = (url: string) => {
  try {
    return new URL(url)
  } catch (e) {
    // TODO: remove this hack after https://github.com/whatwg/url/issues/531 is resolved
    const u = new URL(url, FAKE_HOST)

    return new RelativeUrl(u)
  }
}

export function stripProtocolAndDefaultPorts (urlToCheck: string) {
  // grab host which is 'hostname:port' only
  const { host, hostname, port } = parseUrl(urlToCheck)

  // if we have a default port for 80 or 443
  // then just return the hostname
  if (portIsDefault(port)) {
    return hostname
  }

  // else return the host
  return host
}

export function removeDefaultPort (urlToCheck: any) {
  const parsed = parseUrl(urlToCheck)

  if (portIsDefault(parsed.port)) {
    parsed.port = ''
  }

  return parsed
}

export function addDefaultPort (urlToCheck: any) {
  const parsed = parseUrl(urlToCheck)

  if (!parsed.port) {
    if (parsed.protocol) {
      parsed.port = DEFAULT_PROTOCOL_PORTS[parsed.protocol as Protocols]
    } else {
      parsed.port = ''
    }
  }

  return parsed
}

export function getPath (urlToCheck: string) {
  const url = parseUrl(urlToCheck)

  return `${url.pathname}${url.search}`
}

const localhostIPRegex = /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/

export function isLocalhost (url: URL) {
  return (
    // https://datatracker.ietf.org/doc/html/draft-west-let-localhost-be-localhost#section-2
    url.hostname === 'localhost'
    || url.hostname.endsWith('.localhost')
    // [::1] is the IPv6 localhost address
    // See https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.3
    || url.hostname === '[::1]'
    // 127.0.0.0/8 are considered localhost for IPv4
    // See https://datatracker.ietf.org/doc/html/rfc5735 (Page 3)
    || localhostIPRegex.test(url.hostname)
  )
}

export function origin (urlStr: string) {
  return parseUrl(urlStr).origin
}
