# interview

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd interview`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).


## Tasks
* The `job-new` component has an action handler called `addJob`. There is a handler in the controller
for `jobs/new` to handle the actual saving of the record.  Wire these up so the record is properly saved.

* Right now, in a user can submit a new job without filling in all data.  Please disable the submit
button unless all data is present (don't worry about validation beyond data being in the field).

* On the sidebar, please show the view counts for each job as well as the first 15 characters
of the description.

* On the `charts` route, please build a d3 bar graph that shows job count by company.
