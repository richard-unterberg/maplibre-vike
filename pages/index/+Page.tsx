import { usePageContext } from 'vike-react/usePageContext'

import Limit from '@/components/Limit'
import { getLocalizedAppHref } from '@/data/app-url'
import { getDictionary, normalizeLocale, t } from '@/data/i18n'

const Page = () => {
  const pageContext = usePageContext()
  const locale = normalizeLocale(pageContext.locale)
  const copy = getDictionary(locale).startPage

  return (
    <Limit className="flex h-full items-center">
      <section className="max-w-3xl">
        <p className="text-base-muted text-sm">{t('chemnitzMap', locale)}</p>
        <h1 className="mt-3 text-4xl font-bold text-balance">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-base-content/75 text-lg">{copy.description}</p>
        <a className="btn btn-primary mt-8" href={getLocalizedAppHref('/map', locale)}>
          {t('explorePlaces', locale)}
        </a>
      </section>
    </Limit>
  )
}

export default Page
