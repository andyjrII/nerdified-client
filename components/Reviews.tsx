"use client";

import { useCallback, useEffect, useState } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import Moment from "react-moment";
import StarRating from "@/components/StarRating";
import db from "@/utils/localBase";
import Swal from "sweetalert2";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const DPDefault = "/images/navpages/person_profile.jpg";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    name: string;
    email: string;
  };
}

interface ReviewsProps {
  courseId: number;
}

const Reviews = ({ courseId }: ReviewsProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  const fetchEmail = useCallback(async () => {
    try {
      const data = await db.collection("auth_student").get();
      if (data.length > 0) {
        setEmail(data[0].email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  }, []);

  const fetchImages = useCallback(async (emails: string[]) => {
    try {
      const response = await axiosPrivate.post(`students/imagepaths`, emails);
      const imagePaths = response.data;
      const imageBlobs = await Promise.all(
        imagePaths.map(async (imagePath: string) => {
          try {
            const imageResponse = await axiosPrivate.get(
              `students/student/image/${imagePath}`,
              {
                responseType: "arraybuffer",
              }
            );
            return {
              path: imagePath,
              blob: new Blob([imageResponse.data], { type: "image/jpeg" }),
            };
          } catch (error) {
            return { path: imagePath, blob: null };
          }
        })
      );

      const newImageUrls = new Map<string, string>();
      emails.forEach((email, index) => {
        const blobData = imageBlobs[index];
        if (blobData?.blob) {
          newImageUrls.set(email, URL.createObjectURL(blobData.blob));
        }
      });
      setImageUrls(newImageUrls);
    } catch (error) {
      console.log("Error getting images");
    }
  }, [axiosPrivate]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axiosPrivate.get(`/reviews/course/${courseId}`);
      setReviews(response.data);
      const emails = response.data.map((review: Review) => review.student.email);
      await fetchImages(emails);
    } catch (error) {
      console.log("Error fetching reviews");
    }
  }, [axiosPrivate, courseId, fetchImages]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail();
      } catch (error) {
        console.log("Error during initialization:", error);
      }
    };

    initialize();
  }, [fetchEmail]);

  useEffect(() => {
    if (!email) return;
    const loadReviews = async () => {
      try {
        await fetchReviews();
      } catch (error) {
        console.log("Error during reviews fetch:", error);
      }
    };

    loadReviews();
  }, [courseId, email, fetchReviews]);

  const handleReviewSubmit = async () => {
    if (!email) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "You must be signed in first to make a review!",
        confirmButtonText: "OK",
      });
      return;
    }
    if (newReview.rating === 0) {
      Swal.fire({
        icon: "info",
        title: "Star Rating",
        text: "Please select a star rating!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await axiosPrivate.post(
        `/reviews`,
        { courseId, email, ...newReview },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setNewReview({ rating: 0, comment: "" });
      await fetchReviews();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error submitting review!",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="space-y-6 mt-2">
      <h2 className="text-2xl font-bold">
        <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full">
          Reviews
        </span>
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-md">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                      <Image
                        src={
                          imageUrls.get(review.student.email) || DPDefault
                        }
                        alt={review.student.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h6 className="font-semibold text-wrap">
                        {review.student.name}
                      </h6>
                      <div className="flex">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <small className="text-muted-foreground">
                      <Moment format="MMMM D, YYYY">{review.createdAt}</Moment>
                    </small>
                    <p className="mt-3">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8">
        <CardContent className="p-6">
          <h4 className="text-xl font-bold mb-4">Leave a Review</h4>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Give us a rating:</p>
              <div className="flex">
                <StarRating
                  rating={newReview.rating}
                  setRating={(rating) =>
                    setNewReview({ ...newReview, rating })
                  }
                  editable
                />
              </div>
            </div>
            <div>
              <Textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Write your review here"
                rows={4}
                required
              />
            </div>
            <Button
              onClick={handleReviewSubmit}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Submit Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
