package com.hida.ui.dt

/**
 * Created by hida on 26/5/2014.
 */
class DtReqSearch {
    String value
    boolean regex

    public String toString() { "[$value] ${regex ? 'with regex' : 'no regex'}" }
}
