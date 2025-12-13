/**
 * Error Messages
 *
 * Centralized error messages matching SPEC.md section 6.1
 * Provides user-friendly titles, messages, and recovery actions for all error codes.
 *
 * @see SPEC.md Section 6.1 - Error Handling Specification
 */

import type { ErrorCode } from "@/types";

/**
 * Standardized error message structure
 */
export interface ErrorMessageDetails {
  title: string;
  message: string;
  action: string;
}

/**
 * Error messages for all error codes defined in SPEC.md section 6.1
 *
 * Each error has:
 * - title: Short, user-friendly error title
 * - message: Clear explanation of what went wrong
 * - action: Specific steps the user can take to recover
 */
export const ERROR_MESSAGES: Record<ErrorCode, ErrorMessageDetails> = {
  CAMERA_PERMISSION_DENIED: {
    title: "Camera Access Needed",
    message: "Please allow camera access to take a photo for analysis.",
    action: "Check your browser settings and try again.",
  },
  CAMERA_NOT_FOUND: {
    title: "No Camera Found",
    message: "We couldn't detect a camera on your device.",
    action: "Try uploading a photo instead.",
  },
  NO_FACE_DETECTED: {
    title: "No Face Detected",
    message: "We couldn't find a face in your photo.",
    action: "Make sure your face is clearly visible and well-lit.",
  },
  MULTIPLE_FACES: {
    title: "Multiple Faces Found",
    message: "Please use a photo with only one person.",
    action: "Take a new photo with just yourself.",
  },
  POOR_LIGHTING: {
    title: "Lighting Too Dark",
    message: "The photo is too dark for accurate analysis.",
    action: "Move to a brighter area and try again.",
  },
  IMAGE_TOO_BLURRY: {
    title: "Image Too Blurry",
    message: "The photo is too blurry to analyze.",
    action: "Hold still and ensure the camera is focused.",
  },
  API_RATE_LIMITED: {
    title: "Service Busy",
    message: "Our AI service is experiencing high demand.",
    action: "Please wait a moment and try again.",
  },
  API_ERROR: {
    title: "Analysis Failed",
    message: "Something went wrong during analysis.",
    action: "Please try again. If the problem persists, try a different photo.",
  },
  NETWORK_ERROR: {
    title: "Connection Problem",
    message: "Unable to connect to our servers.",
    action: "Check your internet connection and try again.",
  },
  UNKNOWN_ERROR: {
    title: "Something Went Wrong",
    message: "An unexpected error occurred.",
    action: "Please refresh the page and try again.",
  },
};

/**
 * Get user-friendly error message details for an error code
 *
 * @param code - Error code from ErrorCode type
 * @returns Error message details with title, message, and action
 *
 * @example
 * ```typescript
 * const details = getErrorMessage("CAMERA_PERMISSION_DENIED");
 * console.log(details.title); // "Camera Access Needed"
 * console.log(details.action); // "Check your browser settings and try again."
 * ```
 */
export function getErrorMessage(code: ErrorCode): ErrorMessageDetails {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR;
}
