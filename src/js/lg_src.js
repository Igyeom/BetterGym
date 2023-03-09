var subGameType = 'computer';
        var isPlayingMetricTimer = true;
        var metricInterval;
        function metricAddSeconds(){
            if (!document.hasFocus()) {
                return;
            }

            if(isPlayingMetricTimer) {
                $.request('onAddSeconds', {
                    data: {
                        classroom_id: '',
                        subGameType: subGameType,
                    },
                    success: function (){

                    },
                    error: function (){

                    }
                });
            }
        }

        metricInterval = setInterval(function (){
            metricAddSeconds();
        }, 5000);

        events.subscribe('metric.session.ends', function (){
            if(metricInterval) {
                clearInterval(metricInterval);
            }
        });

        function metricAddCorrect(count, skipAttemptCount){

            var attemptCount = count;
            if(isNaN(count)) {
                count = 1;
                attemptCount = count;
            }

            if(skipAttemptCount) {
                attemptCount = 1;
            }

            $.request('onAddCorrect', {
                data: {
                    classroom_id: '',
                    subGameType: subGameType,
                    count: count,
                    attemptCount: attemptCount
                },
                success: function (){

                },
                error: function (){

                }
            });
        }
        events.subscribe('metric.add.correct', function(count){
            metricAddCorrect(count);
        });

        events.subscribe('metric.add.correct.skipattempt', function (count) {
            metricAddCorrect(count, true);
        });

        var debounceCorrect = _.debounce(metricAddCorrect, 200);
        events.subscribe('metric.add.correct.debounce', function(count){
            // console.log('Add Correct', count);
            debounceCorrect(count);
        });

        function metricAddCAttempt(count){

            if(isNaN(count))
                count = 1;

            $.request('onAddAttempt', {
                data: {
                    classroom_id: '',
                    subGameType: subGameType,
                    count: count
                },
                success: function (){

                },
                error: function (){

                }
            });
        }
        events.subscribe('metric.add.attempt', function(count){
            metricAddCAttempt(count);
        });

        var debounceAttempt = _.debounce(metricAddCAttempt, 200);
        events.subscribe('metric.add.attempt.debounce', function(count){
            // console.log('Addd Attempt', count);
            debounceAttempt(count);
        });

    </script>
<script>
        function fmtMSS(s) {
            return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
        }

        function secondsToTime(secs)
        {
            var hours = Math.floor(secs / (60 * 60));

            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);

            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);

            var obj = {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
            return obj;
        }

        jQuery.fn.shuffleChildren = function () {
            var p = this[0];
            // console.log(p);
            if (typeof p !== 'undefined')
                for (var i = p.children.length; i >= 0; i--) {
                    p.appendChild(p.children[Math.random() * i | 0]);
                }
        };

        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        var gameType = '';
        var gameLevel = ''; //Original

        var vocabGameMode = ''; //For Sequence
        var vocabGameMode2 = ''; //For Sequence
        var vocabGameSet = ''; //For Sequence

        var gameOngoing = false;
        var secondsToSend = 1;
        var gameTotalTime = 0;
        var gameAttempt = 0;
        var totalTranslationQuestion = 0;
        var correctTranslationAnswer = 0;
        var gameCorrect = 0;
        var audioSpeed = 'normal';

        var seconds = 0;
        var minutes = 0;
        var startCount;

        // Stopwatch function
        function stopWatch() {
            seconds++;
            secondsToSend++;
            gameTotalTime++;

            //Display updated time values
            var convertedTime = secondsToTime(seconds);
            var displaySeconds = convertedTime['s'];

            if(displaySeconds < 10)
                displaySeconds = '0'+displaySeconds;

            if(convertedTime['h'] > 0){
                $(".timer").html(convertedTime['h']+':'+convertedTime['m']+':'+displaySeconds);
            } else {
                $(".timer").html(convertedTime['m']+':'+displaySeconds);
            }

            events.publish('timer.going');
        }

        function updateScore() {
            $.request('onRecord', {
                data: {
                    gametype: gameType,
                    level: gameLevel,
                    seconds: secondsToSend
                }, success(response) {
                }
            });

            secondsToSend = 0;
        }

        function updateGameEnd() {
            events.publish('metric.session.ends');

            
                _.templateSettings = {
                  interpolate: /\{\{(.+?)\}\}/g
                };

                var template = _.template(`
                    <li class="row m-0 mb-1">
                        <div class="col-2 pl-0">
                            <div class="quiz-medal">
                                <div class="quiz-medal__circle {{ medal_type }}">
                                    <span>
                                      {{ index }}
                                    </span>
                                </div>
                                <div class="quiz-medal__ribbon quiz-medal__ribbon--left"></div>
                                <div class="quiz-medal__ribbon quiz-medal__ribbon--right"></div>
                            </div>
                        </div>
                        <div class="col-10 p-0 overflow-hidden">{{ score_name }}</div>
                    </li>
                `);
            
            $.request('onGameEnd', {
                data: {
                    gametype: gameType,
                    level: gameLevel,
                    totalTime: gameTotalTime,
                    attempts: gameAttempt,
                    correctTranslationAnswer: correctTranslationAnswer,
                    gameCorrect: gameCorrect
                }, success(response) {
                    if (response.status == 'success') {
                        if (typeof response.ranking !== 'undefined') {
                            $("#leaderboard-list").empty();

                            $.each(response.ranking, function (index, item) {
                                var timeUsed = item[response.sort_by];

                                if (response.sorting_type == 'time') {
                                    timeUsed = fmtMSS(timeUsed);
                                } else if (response.sorting_type == 'turns') {
                                    timeUsed += ' turns - ' + fmtMSS(item[response.sort_by_time]);
                                } else if (response.sorting_type == 'score') {
                                    timeUsed = '(' + fmtMSS(item[response.sort_by_time]) + ') ' +item[response.sort_by] + ' <i class="fa fa-check" aria-hidden="true"></i>';
                                }

                                var medalType = '';
                                switch (index){
                                    case 0:
                                        medalType = 'quiz-medal__circle--gold';
                                        break;

                                    case 1:
                                        medalType = 'quiz-medal__circle--silver';
                                        break;

                                    case 2:
                                        medalType = 'quiz-medal__circle--bronze';
                                        break;

                                    default:
                                        break;
                                }

                                var compiled = template({
                                    index: (index + 1),
                                    medal_type: medalType,
                                    score_name: `${item.user.name} (${timeUsed})`
                                });


                                $("#leaderboard-list").append(compiled);
                            });
                        }
                    }
                }
            });
        }

        function recordProgress() {
            $.request('onSequenceProgress', {
                data: {
                    gametype: gameType,
                    mode: vocabGameMode,
                    mode2: vocabGameMode2,
                    set: vocabGameSet,
                    vcid: ''
                }, success(response) {
                    location.href = 'http://language-gym.com/game/vocabtrainer/play/31215119691d322038220f9cad3e1ed5d6d526f';
                }
            });
        }

        function correctSound(step){
            var selector = '#correct-audio-player';
            if(step > 6)
                step = 6;

            $(selector)[0].volume = 0.5;

            if($(selector)[0].currentTime > 0) {
                $(selector)[0].pause();
                $(selector)[0].currentTime = 0;
            }

            $(selector)[0].play();
        }

        var debounceWrongSound = _.debounce(wrongSound, 300);
        function wrongSound(){
            $("#wrong-audio-player")[0].volume = 0.1;
            $("#wrong-audio-player")[0].pause();
            $("#wrong-audio-player")[0].currentTime = 0;
            $("#wrong-audio-player")[0].play();
        }

        $(function () {
            setInterval(function () {
                if (gameOngoing == false)
                    return;

                updateScore();
            }, 5000);

            $(".btn-audio-speed").click(function (){
                var hasActiveClass = $(this).hasClass('active');
                if(hasActiveClass) {
                    audioSpeed = 'normal';
                    $(this).removeClass('active').addClass('active-normal');
                    $('audio').prop('playbackRate', 1);
                    $(".speed-text").text('Normal');
                } else {
                    audioSpeed = 'slow';
                    $(this).removeClass('active-normal').addClass('active');
                    $('audio').prop('playbackRate', 0.7);
                    $(".speed-text").text('Slower');
                }
            });
        });