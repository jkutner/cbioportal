/** Copyright (c) 2012 Memorial Sloan-Kettering Cancer Center.
 **
 ** This library is free software; you can redistribute it and/or modify it
 ** under the terms of the GNU Lesser General Public License as published
 ** by the Free Software Foundation; either version 2.1 of the License, or
 ** any later version.
 **
 ** This library is distributed in the hope that it will be useful, but
 ** WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF
 ** MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  The software and
 ** documentation provided hereunder is on an "as is" basis, and
 ** Memorial Sloan-Kettering Cancer Center
 ** has no obligations to provide maintenance, support,
 ** updates, enhancements or modifications.  In no event shall
 ** Memorial Sloan-Kettering Cancer Center
 ** be liable to any party for direct, indirect, special,
 ** incidental or consequential damages, including lost profits, arising
 ** out of the use of this software and its documentation, even if
 ** Memorial Sloan-Kettering Cancer Center
 ** has been advised of the possibility of such damage.  See
 ** the GNU Lesser General Public License for more details.
 **
 ** You should have received a copy of the GNU Lesser General Public License
 ** along with this library; if not, write to the Free Software Foundation,
 ** Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA.
 **/

/*
 * Javscript library based on HTML5 Canvas API which renders OncoPrints. 
 */

// These bits are passed as "AlterationSettings" in DrawAlteration -
// they corresponded to names found in org.mskcc.portal.model.GeneticEventImpl
// CNA bits
var AMPLIFIED           = (1<<0);
var GAINED              = (1<<1);
var DIPLOID             = (1<<2);
var HEMIZYGOUSLYDELETED = (1<<3);
var HOMODELETED         = (1<<4);
var NONE                = (1<<5);
// MRNA bits (normal is in GeneticEventImpl, but never used)
var UPREGULATED         = (1<<6);
var DOWNREGULATED       = (1<<7);
var NOTSHOWN            = (1<<8);
// MUTATION bits
var MUTATED             = (1<<9);
var NORMAL              = (1<<10);

// starting size of genetic alteration
var ALTERATION_WIDTH = 6;
var ALTERATION_HEIGHT = 18;

// space between genetic alterations
var ALTERATION_VERTICAL_PADDING = 1;
var ALTERATION_HORIZONTAL_PADDING = 1;

// cna styles
var AMPLIFIED_COLOR           = '#FF0000';
var GAINED_COLOR              = '#FFB6C1';
var DIPLOID_COLOR             = '#D3D3D3';
var HEMIZYGOUSLYDELETED_COLOR = '#8FD8D8';
var HOMODELETED_COLOR         = '#0000FF';
var NONE_COLOR                = '#D3D3D3';

// mrna styles
var MRNA_RECT_WIREFRAME_THICKNESS = ALTERATION_WIDTH * (1/6);
var UPREGULATED_COLOR   = '#FF9999';
var DOWNREGULATED_COLOR = '#6699CC';
var NOTSHOWN_COLOR      = '#FFFFFF';

// mutation styles - if wd or ht changes, DrawMutation must change
var MUTATION_RECT_WIDTH = ALTERATION_WIDTH - MRNA_RECT_WIREFRAME_THICKNESS;
var MUTATION_RECT_HEIGHT = ALTERATION_HEIGHT * (1/3);
var MUTATION_COLOR = '#008000'; // dark green

// for gene - alteration labels
var MAX_LABEL_LENGTH = 0;
var LABEL_FONT       = 'normal 12px verdana'; // font used to render label
var LABEL_SPACING    = '    '; // spaceing between gene and % genetic alteration
var LABEL_PADDING    = ' '; // space between label and first genetic alteration
var LABEL_COLOR      = '#666666';

/*
 * Creates an HTML 5 canvas.
 *
 * parentID - DOM element where we append canvas
 * canvasID - id to give to canvas
 * numGenes - the number of rows
 * numSamples - the number of columns
 * scaleFactor - 1.0 no scale
 */
function CreateCanvas(parentID, canvasID, numGenes, numSamples, longestLabel, scaleFactor) {

	var parentElement = document.getElementById(parentID);
	if (parentElement) {
		var canvas = document.getElementById(canvasID);
		if (canvas == null) {
			canvas = document.createElement('canvas');
			canvas.setAttribute('id', canvasID);
		}
		if (canvas && canvas.getContext) {
			var context = canvas.getContext('2d');
			if (context) {
				// compute max label length & store
				context.save();
				context.scale(scaleFactor, scaleFactor);
				context.font = LABEL_FONT;
				var maxLabelLengthInPixels = context.measureText(longestLabel + LABEL_SPACING + LABEL_PADDING);
				context.restore();
				MAX_LABEL_LENGTH = maxLabelLengthInPixels.width;
				// set canvas dimensions -
				// we want enough space for each alteration w/padding.  remove padding on the right/bottom
				var canvasHeight = numGenes * (ALTERATION_HEIGHT + ALTERATION_VERTICAL_PADDING) - ALTERATION_VERTICAL_PADDING;
				var canvasWidth = MAX_LABEL_LENGTH + numSamples * (ALTERATION_WIDTH + ALTERATION_HORIZONTAL_PADDING) - ALTERATION_HORIZONTAL_PADDING;
				canvas.setAttribute('width', canvasWidth * scaleFactor);
				canvas.setAttribute('height', canvasHeight * scaleFactor);
				parentElement.appendChild(canvas);
			}
		}
	}
}

/*
 * Draws gene - gene alteration label at start of given row
 */
function DrawLabel(canvasID, row, gene, alterationValue, scaleFactor) {

	var canvasElement = document.getElementById(canvasID);
	if (canvasElement && canvasElement.getContext) {
		var context = canvasElement.getContext('2d');
		if (context) {
			context.save();
			context.scale(scaleFactor, scaleFactor);
			context.fillStyle    = LABEL_COLOR;
			context.font         = LABEL_FONT;
			context.textBaseline = 'middle';
			var label = gene + LABEL_SPACING + alterationValue + LABEL_PADDING;
			var labelLength = context.measureText(label);
			var x = GetXCoordinate(0) - labelLength.width;
			alert(x);
			var y = GetYCoordinate(row) + ALTERATION_HEIGHT / 2;
			context.fillText(label, x, y);
			context.restore();
		}
	}	
}

/*
 * Draws an alteration cell on the given canvas.
 *
 * canvasID - id of the canvas for drawing
 * row - the row (gene) index
 * column - the column (sample) index
 * alterationSettings - the bits which describe what to draw
 * scaling factor (1.0 - no scale)
 */
function DrawAlteration(canvasID, row, column, alterationSettings, scaleFactor) {

	var canvasElement = document.getElementById(canvasID);
	if (canvasElement && canvasElement.getContext) {
		var context = canvasElement.getContext('2d');
		if (context) {
			context.save();
			context.scale(scaleFactor, scaleFactor);
			DrawMRNA(context, row, column, alterationSettings);
			DrawCNA(context, row, column, alterationSettings);
			DrawMutation(context, row, column, alterationSettings);			
			context.restore();
		}
	}
}

/*******************************************************************************
//
// The following functions are for internal use only.
//
*******************************************************************************/

function DrawCNA(context, row, column, alterationSettings) {

	if (alterationSettings & AMPLIFIED) {
		context.fillStyle = AMPLIFIED_COLOR;
	}
	else if (alterationSettings & GAINED) {
		context.fillStyle = GAINED_COLOR;
	}
	else if (alterationSettings & DIPLOID) {
		context.fillStyle = DIPLOID_COLOR;
	}
	else if (alterationSettings & HEMIZYGOUSLYDELETED) {
		context.fillStyle = HEMIZYGOUSLYDELETED_COLOR;
	}
	else if (alterationSettings & HOMODELETED) {
		context.fillStyle = HOMODELETED_COLOR;
	}
	else if (alterationSettings & NONE) {
		context.fillStyle = NONE_COLOR;
	}
	// we clear & then fill instead of
	// using stroke because this is more precise
	var rectWidth = ALTERATION_WIDTH-MRNA_RECT_WIREFRAME_THICKNESS*2;
	var rectHeight = ALTERATION_HEIGHT-MRNA_RECT_WIREFRAME_THICKNESS*2;
	var x = GetXCoordinate(column);
	var y = GetYCoordinate(row);
	// we want to draw CNA with a frame around it (MRNA_RECT_WIREFRAME_THICKNESS)
	context.clearRect(x + MRNA_RECT_WIREFRAME_THICKNESS,
					  y + MRNA_RECT_WIREFRAME_THICKNESS,
					  rectWidth, rectHeight);
	context.fillRect(x + MRNA_RECT_WIREFRAME_THICKNESS,
					 y + MRNA_RECT_WIREFRAME_THICKNESS,
					 rectWidth, rectHeight);
}

function DrawMRNA(context, row, column, alterationSettings) {

	if (alterationSettings & UPREGULATED) {
		context.fillStyle = UPREGULATED_COLOR;
	}
	else if (alterationSettings & DOWNREGULATED) {
		context.fillStyle = DOWNREGULATED_COLOR;
	}
	else if (alterationSettings & NOTSHOWN) {
		context.fillStyle = NOTSHOWN_COLOR;
	}
	context.lineWidth = MRNA_RECT_WIREFRAME_THICKNESS;
	var x = GetXCoordinate(column);
	var y = GetYCoordinate(row);
	context.fillRect(x, y, ALTERATION_WIDTH, ALTERATION_HEIGHT);
}

function DrawMutation(context, row, column, alterationSettings) {

	if (alterationSettings & MUTATED) {
		context.fillStyle = MUTATION_COLOR;
		// translate row/col into canvas coordinates
		var x = GetXCoordinate(column);
		var y = GetYCoordinate(row);
		// center mutation square vertical & start drawing halfway into MRNA WIREFRAME
		context.fillRect(x + MRNA_RECT_WIREFRAME_THICKNESS / 2,
						 y + ALTERATION_HEIGHT / 2 - MUTATION_RECT_HEIGHT / 2,
						 MUTATION_RECT_WIDTH, MUTATION_RECT_HEIGHT);
	}
}

function GetXCoordinate(column) {
	return (column * (ALTERATION_WIDTH + ALTERATION_HORIZONTAL_PADDING) + MAX_LABEL_LENGTH);
}

function GetYCoordinate(row) {
	return row * (ALTERATION_HEIGHT + ALTERATION_VERTICAL_PADDING);
}
