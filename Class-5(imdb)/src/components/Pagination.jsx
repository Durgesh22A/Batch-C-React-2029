function Pagination({ decrementPage, incrementPage, pageNumber }) {
  return (
    <div className="bg-gray-400 h-15 flex justify-center items-center gap-3">
      <button
        type="button"
        onClick={decrementPage}
        disabled={pageNumber <= 1}
        aria-label="Previous page"
        className={`${
          pageNumber <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90"
        }`}
      >
        <i className="fa-solid fa-arrow-left" />
      </button>
      <div>{pageNumber}</div>
      <button
        type="button"
        onClick={incrementPage}
        aria-label="Next page"
        className="hover:opacity-90"
      >
        <i className="fa-solid fa-arrow-right" />
      </button>
    </div>
  );
}

export default Pagination;
