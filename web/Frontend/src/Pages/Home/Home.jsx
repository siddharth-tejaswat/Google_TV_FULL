import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [processedImages, setProcessedImages] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5001/record`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fetchedData = await response.json();
      console.log("Fetched data: ", fetchedData);

      let images = [];
      if (Array.isArray(fetchedData)) {
        images = fetchedData.map((item) => ({
          RECORD_PRIMARY_ID: item.RECORD_PRIMARY_ID,
          DATE_TIMESTAMP: item.DATE_TIMESTAMP[0],
        }));
      } else if (fetchedData && Array.isArray(fetchedData.rows)) {
        images = fetchedData.rows.map((item) => ({
          RECORD_PRIMARY_ID: item.RECORD_PRIMARY_ID,
          DATE_TIMESTAMP: item.DATE_TIMESTAMP[0],
        }));
      } else {
        console.error(
          "Expected data to be an array or have a 'rows' property that is an array, but got:",
          fetchedData
        );
      }

      // Sort images based on DATE_TIMESTAMP, latest first
      images.sort(
        (a, b) => new Date(b.DATE_TIMESTAMP) - new Date(a.DATE_TIMESTAMP)
      );

      setProcessedImages(images);
      setCurrentImageIndex(0); // Set to display the latest image
    } catch (err) {
      console.log("Failed to Fetch: ", err);
      setProcessedImages([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : processedImages.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < processedImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <main className="flex-1 relative">
      <div className="w-full h-[80vh] md:h-[80vh]">
        {processedImages.length > 0 && (
          <img
            src={`/GTV_IMAGE_TESTING/processed_images/${processedImages[
              currentImageIndex
            ].RECORD_PRIMARY_ID[0].slice(7)}`}
            alt={`Processed Image ${currentImageIndex + 1}`}
            className="w-full h-full object-fit"
          />
        )}
      </div>

      <div className="absolute bottom-0 w-full p-4 flex flex-wrap justify-center items-center space-x-3 bg-black/[0.8] rounded-lg">
        <button
          onClick={handlePreviousImage}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
          title="Previous Image"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={handleNextImage}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
          title="Next Image"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {processedImages.length > 0 && (
        <div className="absolute left-2 bottom-2 bg-black px-4 py-2 text-white rounded-lg">
          Image Timestamp:{" "}
          {new Date(
            processedImages[currentImageIndex].DATE_TIMESTAMP
          ).toLocaleString()}
        </div>
      )}
    </main>
  );
}
