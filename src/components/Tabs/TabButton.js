import clsx from "clsx";

const TabButton = ({ setIngredientsPriceContent, ingredientsPriceContent }) => {
    return (
        <div className='bg-gray-100 py-4 grid grid-cols-3 gap-2 ml-auto'>
            <div className='flex justify-end'>
                <button
                    className={clsx(
                        'items-center px-2 py-2 rounded-xl font-bold border border-1 hover:text-main hover:border-main hover:bg-white',
                        ingredientsPriceContent === 'stores' && 'text-main border-main bg-white',
                        ingredientsPriceContent !== 'stores' && 'text-white border-main bg-main',
                    )}
                    onClick={() => setIngredientsPriceContent('stores')}
                >
                    Stores
                </button>
            </div>
            <div className='flex justify-end'>
                <button
                    className={clsx(
                        'items-center px-2 py-2 rounded-xl font-bold border border-1 hover:text-main hover:border-main hover:bg-white',
                        ingredientsPriceContent === 'best-offer' && 'text-main border-main bg-white',
                        ingredientsPriceContent !== 'best-offer' && 'text-white border-main bg-main',
                    )}
                    onClick={() => setIngredientsPriceContent('best-offer')}
                >

                    The best offer
                </button>
            </div>
        </div>
    );
}

export default TabButton;