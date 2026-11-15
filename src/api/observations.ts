// TEMPORARY LOCAL STUB. Gareth owns this file. 
import type { AmrObservation } from '../types'

export interface ObservationFilters {
  areaCode?: string
  pathogen?: string
  antimicrobial?: string
  startDate?: string
  endDate?: string
}

export async function getObservations(filters?: ObservationFilters): Promise<AmrObservation[]> {
  void filters
  throw new Error("stub: replace with Gareth's implementation")
}