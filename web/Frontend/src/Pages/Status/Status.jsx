"use client";

import { useState, useMemo, useEffect } from "react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  FilterIcon,
} from "lucide-react";

export default function Status() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    "Date",
    "Barcode",
    "Status",
  ]);
  const [data, setData] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [sortMethod, setSortMethod] = useState("time");
  const [imgSrc, setImgSrc] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 12;

  const getBarcodeValue = (barcodeNumber) => {
    if (
      !barcodeNumber ||
      barcodeNumber.length === 0 ||
      barcodeNumber[0] === null
    )
      return "NOT DETECTED";
    if (Array.isArray(barcodeNumber[0])) return barcodeNumber[0].join(", ");
    return String(barcodeNumber[0]);
  };

  const getBarcodeBackgroundColor = (barcodeValue) => {
    return barcodeValue === "NOT DETECTED" ? "bg-red-100" : "bg-green-100";
  };

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter((item) => {
      const barcodeValue = getBarcodeValue(item.BARCODE_NUMBER);
      const matchesSearch =
        barcodeValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.DATE_TIMESTAMP &&
          item.DATE_TIMESTAMP[0] &&
          item.DATE_TIMESTAMP[0]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (item.OVERALL_STATUS &&
          item.OVERALL_STATUS[0] &&
          item.OVERALL_STATUS[0]
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => {
          if (filter === "Date")
            return item.DATE_TIMESTAMP && item.DATE_TIMESTAMP[0];
          if (filter === "Barcode") return true; // Always include Barcode filter
          if (filter === "Status")
            return item.OVERALL_STATUS && item.OVERALL_STATUS[0];
          return false;
        });

      const matchesColors =
        selectedColors.length === 0 ||
        (barcodeValue !== "NOT DETECTED" &&
          selectedColors.includes("Success")) ||
        (barcodeValue === "NOT DETECTED" && selectedColors.includes("Failure"));

      return matchesSearch && matchesFilters && matchesColors;
    });

    result.sort((a, b) => {
      if (sortMethod === "time") {
        const dateA = new Date(a.DATE_TIMESTAMP[0]);
        const dateB = new Date(b.DATE_TIMESTAMP[0]);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortMethod === "barcode") {
        const valueA = getBarcodeValue(a.BARCODE_NUMBER);
        const valueB = getBarcodeValue(b.BARCODE_NUMBER);
        if (valueA === "NOT DETECTED" && valueB === "NOT DETECTED") return 0;
        if (valueA === "NOT DETECTED") return sortOrder === "asc" ? -1 : 1;
        if (valueB === "NOT DETECTED") return sortOrder === "asc" ? 1 : -1;
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (sortMethod === "status") {
        const valueA =
          a.OVERALL_STATUS && a.OVERALL_STATUS[0] ? a.OVERALL_STATUS[0] : "";
        const valueB =
          b.OVERALL_STATUS && b.OVERALL_STATUS[0] ? b.OVERALL_STATUS[0] : "";
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });

    return result;
  }, [
    data,
    searchTerm,
    selectedFilters,
    selectedColors,
    sortMethod,
    sortOrder,
  ]);

  const pageCount = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1);
  };

  const toggleColorFilter = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const openModal = (item) => {
    console.log("Opening modal for item:", item);
    setModalContent(item);
    let imageNames = [];
    if (item.GTV_IMAGE && Array.isArray(item.GTV_IMAGE)) {
      if (Array.isArray(item.GTV_IMAGE[0])) {
        imageNames = item.GTV_IMAGE[0].map((path) =>
          typeof path === "string" ? path.split(/[/\\]/).pop() : ""
        );
      } else if (typeof item.GTV_IMAGE[0] === "string") {
        imageNames = [item.GTV_IMAGE[0].split(/[/\\]/).pop()];
      }
    }
    if (imageNames.length === 0) {
      console.error("No valid image data found");
    }
    setImgSrc(imageNames);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const handleSort = (method) => {
    if (sortMethod === method) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortMethod(method);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const clearAppliedFilters = () => {
    setSortMethod("time");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imgSrc.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imgSrc.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(`http://localhost:5001/record`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fetchedData = await response.json();
      console.log("Fetched data: ", fetchedData);
      if (Array.isArray(fetchedData)) {
        setData(fetchedData);
      } else if (fetchedData && Array.isArray(fetchedData.rows)) {
        setData(fetchedData.rows);
      } else {
        console.error(
          "Expected data to be an array or have a 'rows' property that is an array, but got:",
          fetchedData
        );
        setData([]);
      }
    } catch (err) {
      console.log("Failed to Fetch: ", err);
      setData([]);
    }
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="px-3 py-1 rounded bg-gray-200"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
      buttons.push(
        <button
          key={pageCount}
          onClick={() => setCurrentPage(pageCount)}
          className="px-3 py-1 rounded bg-gray-200"
        >
          {pageCount}
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/6 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Keywords</h2>
          <div className="space-y-2">
            {["Date", "Barcode", "Status"].map((filter) => (
              <div key={filter} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={filter}
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor={filter} className="text-sm">
                  {filter}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Status: </h3>
            {["Success", "Failure"].map((color) => (
              <div key={color} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id={color}
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColorFilter(color)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor={color} className="text-sm capitalize">
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-5/6 p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-8 border rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <SearchIcon
                className="absolute left-2 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="mb-4 flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                sortMethod === "barcode"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleSort("barcode")}
            >
              Barcode{" "}
              {sortMethod === "barcode" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                sortMethod === "time" ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleSort("time")}
            >
              Time {sortMethod === "time" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                sortMethod === "status"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleSort("status")}
            >
              Status{" "}
              {sortMethod === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white"
              onClick={clearAppliedFilters}
            >
              Clear Filters{" "}
              <FilterIcon className="inline-block ml-1" size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {selectedFilters.includes("Barcode") && (
                    <th className="border p-2 text-left">BARCODE</th>
                  )}
                  {selectedFilters.includes("Date") && (
                    <th className="border p-2 text-left">TIME</th>
                  )}
                  {selectedFilters.includes("Status") && (
                    <th className="border p-2 text-left">STATUS</th>
                  )}
                  <th className="border p-2 text-left">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.RECORD_PRIMARY_ID + index}
                    className="bg-gray-50"
                  >
                    {selectedFilters.includes("Barcode") && (
                      <td
                        className={`border p-2 ${getBarcodeBackgroundColor(
                          getBarcodeValue(item.BARCODE_NUMBER)
                        )}`}
                      >
                        {getBarcodeValue(item.BARCODE_NUMBER)}
                      </td>
                    )}
                    {selectedFilters.includes("Date") && (
                      <td className="border p-2">
                        {item.DATE_TIMESTAMP && item.DATE_TIMESTAMP[0]}
                      </td>
                    )}
                    {selectedFilters.includes("Status") && (
                      <td className="border p-2">
                        {item.OVERALL_STATUS && item.OVERALL_STATUS[0]}
                      </td>
                    )}
                    <td className="border p-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => openModal(item)}
                      >
                        view
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeftIcon size={20} />
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
              className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Barcode Details:</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p>
                <strong>Barcode:</strong>{" "}
                {getBarcodeValue(modalContent.BARCODE_NUMBER)}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {modalContent.DATE_TIMESTAMP && modalContent.DATE_TIMESTAMP[0]}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {modalContent.OVERALL_STATUS && modalContent.OVERALL_STATUS[0]}
              </p>
              <p>
                <strong>Images: </strong>
              </p>

              {imgSrc.length > 0 ? (
                <div className="relative mt-4">
                  <img
                    src={`/GTV_IMAGE_TESTING/cropped_barcode_images/${imgSrc[currentImageIndex]}`}
                    alt={`Barcode Image ${currentImageIndex + 1}`}
                    className="w-full h-64 object-contain border-black border-4"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
                  >
                    <ChevronLeftIcon size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
                  >
                    <ChevronRightIcon size={24} />
                  </button>
                  <p className="text-center mt-2">
                    Image {currentImageIndex + 1} of {imgSrc.length}
                  </p>
                </div>
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
