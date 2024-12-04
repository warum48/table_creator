export const FilterItemContainer = ({children}:{children:React.ReactNode}) => {
    return (
        <div className={`gridItem relative max-w-full flex-1 min-w-[120px]`}>
            {children}
        </div>
    )
}