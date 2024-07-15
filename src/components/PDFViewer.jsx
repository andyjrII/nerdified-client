import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Viewer from 'viewerjs';

const PDFViewer = () => {
  const axiosPrivate = useAxiosPrivate();

  const [pdfData, setPdfData] = useState();

  const pdfViewerRef = useRef();

  const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
  if (course) var courseId = course.id;

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const response = await axiosPrivate.get(`courses/details/${courseId}`, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          responseType: 'arraybuffer',
        });
        const pdfBlob = new Blob([response.data], {
          type: 'application/pdf',
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfData(pdfUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (course) getCourseDetails();
  }, [courseId]);

  useEffect(() => {
    if (pdfData) {
      const viewer = new Viewer(pdfViewerRef.current, {
        inline: true,
        title: false,
        navbar: false,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 0,
          play: {
            show: 1,
            size: 'large',
          },
          next: 0,
          rotateLeft: 0,
          rotateRight: 0,
          flipHorizontal: 0,
          flipVertical: 0,
        },
      });
      return () => {
        viewer.destroy();
      };
    }
  }, [pdfData]);

  return (
    <div className='col-md-9 payment-head rounded mb-4'>
      <div className='my-4'>
        <div ref={pdfViewerRef} className='viewer-container'>
          {pdfData && (
            <embed
              src={pdfData}
              type='application/pdf'
              width='100%'
              height='600'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
