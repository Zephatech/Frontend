import { Product } from '@/app/_utils/api/products'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

import AskToBuy from '../../components/ask-to-buy'

const getProductData = async (id: number) => {
  let res = await fetch(`http://localhost:3001/products/${id}`, {
    cache: 'no-cache',
  })
  res = await res.json()
  return res
}

export default async function Page({ params }: { params: { id: number } }) {
  const product = (await getProductData(params.id)) as unknown as Product
  const showCourseLink = product.options !== null && product.options?.course

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="font-medium text-gray-500 hover:text-gray-900">
              {product.category}
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section aria-labelledby="information-heading" className="mt-4">
              <h2 id="information-heading" className="sr-only">
                Product information
              </h2>

              <div className="flex items-center">
                <p className="text-lg text-gray-900 sm:text-xl">
                  ${product.price}
                </p>
              </div>
              <div className="mt-4 space-y-6">
                <p className="text-base text-gray-500">{product.description}</p>
              </div>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                  aria-hidden="true"
                />
                <p className="ml-2 text-sm text-gray-500">Good Seller Rating</p>
              </div>

              {showCourseLink && (
                <div className="mt-6 flex items-center">
                  <a
                    href={`https://uwflow.com/course/${showCourseLink}`}
                    className="text-sm text-blue-500 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Related courses on UWFlow
                  </a>
                </div>
              )}
            </section>
          </div>
          <div className="mt-10 md:col-start-2 md:row-span-2 md:mt-0 md:self-center">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <img
                src={
                  product.image === ''
                    ? 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg'
                    : `/images/${product.image}`
                }
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          {/* Product form */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <section aria-labelledby="options-heading">
              <h2 id="options-heading" className="sr-only">
                Product options
              </h2>

              <form>
                <AskToBuy ownerId={product.ownerId} productId={product.id} />
                <div className="mt-6 text-center">
                  <a
                    href="#"
                    className="group inline-flex text-base font-medium"
                  >
                    <ShieldCheckIcon
                      className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="text-gray-500 hover:text-gray-700">
                      Student to Student Guarantee
                    </span>
                  </a>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
