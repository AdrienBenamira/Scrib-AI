import React, {Component} from 'react';

export const Intro = (props) => (
        <div>

            <h1>An AI for automatic and abstractive summarization</h1>
            <img src={require('../../images/LogoCS.png')} style={{display: 'block', width: '100%', maxWidth: 400, margin: "50px auto"}} />
            <p>When we look at the progress of machine learning today, there is one of its domain that is behind
                the others: Natural Language Processing. Yet, speech is the most important communication device
                to humans that we use to convey knowledge, what we think, what we believe. In fact, NLP (Natural
                Language Processing) is a difficult topic because simple configuration of words represents more than
                just vectors as machines perceive it, but information and is actual associated with images, sound,
                experiences.</p>
            <p>In this project, we will tackle semantic summarization: giving a text, we will work with articles
                in our project, we want to generate a text containing the same semantic meaning but with less
                words. The objective is not to achieve a lossless compression of the article but rather select the
                most important pieces of information to fill a given text length. For instance, we would like to summarize well with a ratio of 40% of the original
                text length.</p>
            <h3>The project is available online on github <a href={"https://github.com/AdriBenben/Scrib-AI"}>https://github.com/AdriBenben/Scrib-AI</a></h3>
                <p>The software part of the projet aims to build an interface to:</p>
                <ul>
                    <li>Summarize articles from plain text grade it and correct it</li>
                        <li>Extract the article of a given website and summarize it</li>
                            <li>Make an article & summary dataset for the implementation of the neural network</li>
                                <li>Visualize our data</li>
                </ul>



        </div>
);
