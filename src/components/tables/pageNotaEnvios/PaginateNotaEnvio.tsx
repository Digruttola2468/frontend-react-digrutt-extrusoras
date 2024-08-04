import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useNotaEnvio } from "../../../context/NotaEnvios.context";

const PaginateTable = () => {
    const { tableData, apiOriginal, startPagination, endPagination, page, setPage, nextPagination,previusPagination } = useNotaEnvio();

    const classNameSelectedPage = "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

    const classNameNotSelectedPage = "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"


    return <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div className="flex flex-1 justify-between sm:hidden">
        <a
            onClick={previusPagination}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            Previous
        </a>
        <a
            onClick={nextPagination}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            Next
        </a>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
            <p className="text-sm text-gray-700">
                <span className="font-medium">{startPagination}</span> de <span className="font-medium">{endPagination}</span> con {' '}
                <span className="font-medium">{apiOriginal.length}</span> Notas de Envios en Total
            </p>
        </div>
        <div>
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <a
                    onClick={previusPagination}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    <span className="sr-only">Previous</span>
                    <IoIosArrowBack aria-hidden="true" className="h-5 w-5" />
                </a>
                {
                    Array.from({ length: Math.ceil(tableData.length / 10) }, (_, index) => index + 1).map(e => {
                        return <a key={e + 1}
                            aria-current="page"
                            className={page == e ? classNameSelectedPage : classNameNotSelectedPage}
                            onClick={() => setPage(e)}
                        >
                            {e}
                        </a>
                    })}
                <a
                    onClick={nextPagination}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    <span className="sr-only" >Next</span>
                    <IoIosArrowForward aria-hidden="true" className="h-5 w-5" />
                </a>
            </nav>
        </div>
    </div>
</div>
}

export default PaginateTable