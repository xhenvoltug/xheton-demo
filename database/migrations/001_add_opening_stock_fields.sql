-- Migration: Add type and approved_by fields to goods_received_notes for Opening Stock support
-- Date: 2025-12-14
-- Purpose: Enable opening stock initialization feature

ALTER TABLE goods_received_notes 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'regular';

COMMENT ON COLUMN goods_received_notes.type IS 'Type of GRN: regular or opening_stock';

ALTER TABLE goods_received_notes 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

ALTER TABLE goods_received_notes 
ADD COLUMN IF NOT EXISTS approved_by UUID;

ALTER TABLE goods_received_notes 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

COMMENT ON COLUMN goods_received_notes.deleted_at IS 'Soft delete timestamp';

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS idx_goods_received_notes_type ON goods_received_notes(type);

-- Update existing GRNs to be 'regular' type
UPDATE goods_received_notes SET type = 'regular' WHERE type IS NULL;
