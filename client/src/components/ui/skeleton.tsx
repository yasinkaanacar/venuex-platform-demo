import * as React from "react"
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  borderRadius: 6,
  backgroundColor: theme.palette.action.hover,
}))

interface SkeletonProps extends MuiSkeletonProps {
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return <StyledSkeleton {...props} />
}

export { Skeleton }