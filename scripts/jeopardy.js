/** catQuestData should look like:
 *  [
 *    { title: "Math",
 *      clues: [
 *        {question: "2+2", answer: 4, showing: null},
 *        {question: "1+1", answer: 2, showing: null}
 *        ...
 *      ],
 *    },
 *    { title: "Literature",
 *      clues: [
 *        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *        {question: "Bell Jar Author", answer: "Plath", showing: null},
 *        ...
 *      ],
 *    },
 *    ...
 * ]
*/

/**
 209 : Art
 1892: Video Games
 4483: Three Letter Animals
 88: Geography
 218: Science and Nature
 1072: Physics
 881 : Chemistry
 7355 : Superheroes
 574 : Literature
 16 : Cars
 3336 : The Cold War
 6224 : War
 14701 : Space Firsts
 388 : Astronomy
 7347 : Airplanes
 380 : World War II
 411 : Russia
 1147 : Tennis
 1686: Inventors & Inventions
 2760 : Fruit
 1808 : World War I
 651 : The Middle Ages
 726 : Medicine
 1404 : Philosophy
 3333 : Communism
 1150 : Geology
 1140 : Science Fiction
 2350 : Star Wars
 538 : Mathematics
 863 : The Comics
 530 : World History
 50 : US History
 809 : European History
 7740 : Ancient History
 286 : Engineering
 1559 : Art & Artists
 9238 : Dictators & Tyrants
 255 : Weapons
 12876 : Nuclear Weapons 101
 6436 : Weapons of War
 3968 : The Vietnam War
 1896 : Computers
 14508 : Mushrooms
 11948 : Explorers and Explorations
 */

function hasNoDuplicates(arr) {
	return arr.every(function(val) {
		return arr.indexOf(val) === arr.lastIndexOf(val);
	});
}

function randomCat() {
	let sixCat = [];
	while (sixCat.length < 6) {
		const categories = [
			209,
			1892,
			4483,
			88,
			218,
			1072,
			881,
			7355,
			574,
			16,
			3336,
			6224,
			14701,
			388,
			7347,
			380,
			411,
			1147,
			1686,
			2760,
			1808,
			651,
			726,
			1404,
			3333,
			1150,
			1140,
			2350,
			538,
			863,
			530,
			50,
			809,
			7740,
			286,
			1559,
			9238,
			255,
			12876,
			6436,
			3968,
			1896,
			14508,
			11948,
			10646,
			16250,
			311,
			7312,
			49,
			770,
			17982,
			1445,
			131
		];
		let random = Math.floor(Math.random() * categories.length);
		sixCat.push(categories[random]);
		if (!hasNoDuplicates(sixCat)) {
			sixCat = [];
			randomCat();
		}
	}
	return sixCat;
}

async function randomQuestions(catId) {
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	/** Return object with data about a category:
     *
     *  Returns { title: "Math", clues: arrayClue }
     *
     * Where arrayClue is:
     *   [
     *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
     *      {question: "Bell Jar Author", answer: "Plath", showing: null},
     *      ...
     *   ]
     */
	const response = await axios.get(`https://jservice.io/api/category?id=${catId}`);
	let questions = response.data.clues;
	let fiveUniqueQuest = shuffle(questions).slice(0, 5);
	let arrayClue = fiveUniqueQuest.map((result) => {
		return { question: result.question, answer: result.answer };
	});
	let categoryData = { title: response.data.title, clues: arrayClue };
	return categoryData;
	// console.log(categoryData)
}

const WIDTH = 6;
const HEIGHT = 5;

let board = [];

/** makeBoard: create in-JS board structure:
  */

function makeBoard() {
	//    TODO: set "board" to empty HEIGHT x WIDTH matrix array
	//    The makeBoard() function needs to be implemented.
	//    It should set the global board variable to be an array of 5 arrays (height), each containing 6 items (width).
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH })); // Uses static method Array.from with the length of the width.
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

async function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const $htmlBoard = $('<table id="jeopardy"></table>');
	$('body').append($htmlBoard);
	let $top = $('<tr id="categories"></tr>'); // create a variable for the top 'table row' element
	$($htmlBoard).append($top);
	let catQuestData = [];
	let categoryNums = randomCat(); // array of the random categories

	/** Fill the HTML table#jeopardy with the categories & cells for questions.
    *
    * - The <thead> should be filled w/a <tr>, and a <td> for each category
    * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
    *   each with a question for each category in a <td>
    *   (initally, just show a "?" where the question/answer would go.)
    */
	for (let category of categoryNums) {
		catQuestData.push(await randomQuestions(category));
	}
	for (let x = 0; x < WIDTH; x++) {
		// looping through each of the 7 cells of the tr
		let $headCell = $('<th></th>'); // create table data cell elements and set them to the var headCell
		$headCell.attr('id', x); // give the headCell an id of x
		$headCell.html(catQuestData[x].title);
		$top.append($headCell); // add these headCells to the top variable.
	}
	$htmlBoard.append($top); // finally, add the top to the actual htmlBoard

	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		// loop the same way we did with the headCell, but this time for the game board row
		const $row = $('<tr></tr>');

		/** Handle clicking on a clue: show the question or answer.
        *
        * Uses .showing property on clue to determine what to show:
        * - if currently null, show question & set .showing to "question"
        * - if currently "question", show answer & set .showing to "answer"
        * - if currently "answer", ignore click
        * */
		for (let x = 0; x < WIDTH; x++) {
			// loop through the columns of the game board
			let $cell = $('<td></td>'); // the table data cell
			$cell.html('?');
			$cell.attr('id', `${y}-${x}`); // set the id of the td to the coordinates
			$row.append($cell); // add the finished data cell to the row tr
			$($cell).on('click', function(evt) {
				for (let y = 0; y < HEIGHT; y++) {
					for (let x = 0; x < WIDTH; x++) {
						if (evt.target.id === `${y}-${x}`) {
							if ($(evt.target).html() !== '?') {
								$(evt.target).html(`${catQuestData[x].clues[y].answer}`);
							} else {
								$(evt.target).html(`${catQuestData[x].clues[y].question}`);
							}
						}
					}
				}
			});
		}
		$htmlBoard.append($row); // now add the row to the htmlBoard element
	}
}

makeHtmlBoard();

function setupAndStart() {
	$('.title-container').after('<button id="restart">Restart</button>');
	$('#restart').on('click', function() {
		$('#jeopardy').remove();
		makeHtmlBoard();
	});
}
setupAndStart();
