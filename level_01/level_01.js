exports.findPage = (context, inpMessage) => {
	console.log(context.currentStep);
	console.log(inpMessage);
	if (context.currentStep === '01') {
		if (inpMessage === 'next') {
			context.currentStep = '02';
			return './level_01/views/step_02.txt';
		} else {
			return './level_01/views/step_01.txt';
		}
	} else if (context.currentStep === '02') {
		if (inpMessage === 'next') {
			context.currentStep = '03';
			return './level_01/views/step_03.txt';
		} else {
			return './level_01/views/step_02.txt';
		}
	} else if (context.currentStep === '03') {
		if (inpMessage === 'take umbrella') {
			context.currentStep = '04_a';
			return './level_01/views/step_04_a.txt';
		} else if (inpMessage === 'leave umbrella') {
			context.currentStep = '04_b';
			return './level_01/views/step_04_b.txt';
		} else {
			return './level_01/views/step_03.txt';
		}
	} else {
		context.currentStep = '01';
		return './level_01/views/step_01.txt';
	}
};
