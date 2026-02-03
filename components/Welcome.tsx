"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeProps {
  name?: string;
}

const Welcome = ({ name }: WelcomeProps) => {
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    fetchQuote();
    const intervalId = setInterval(() => {
      fetchQuote();
    }, 1800000); // 30 minutes

    return () => clearInterval(intervalId);
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      setQuote(response.data.slip.advice);
    } catch (error) {
      console.error("Error fetching Quote!", error);
    }
  };

  return (
    <Card className="bg-blue-900 text-white">
      <CardHeader>
        <CardTitle className="text-white">Welcome back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white text-lg">
          &quot;{name || "Student"},{" "}
          {quote ? (
            <>{quote.toLowerCase()}</>
          ) : (
            <>
              Education is the ability to listen to anything without losing
              your temper or your self-confidence.
            </>
          )}
          &quot;
        </p>
      </CardContent>
    </Card>
  );
};

export default Welcome;
