import numpy as np

def linear_regression(time, value):
    # calculate the means of the input lists
    x_mean = np.mean(time)
    y_mean = np.mean(value)

    # calculate the numerator and denominator of the slope
    numerator = sum((time - x_mean) * (value - y_mean))
    denominator = sum((time - x_mean) ** 2)

    # calculate the slope (m) and y-intercept (b) of the linear regression line
    m = numerator / denominator
    b = y_mean - m * x_mean

    # return the slope and y-intercept as a tuple
    return (m, b)