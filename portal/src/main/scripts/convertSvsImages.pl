#!/usr/bin/perl
require "../scripts/env.pl";

system ("$JAVA_HOME/bin/java -Xmx4g -cp $cp org.mskcc.cbio.cgds.scripts.ConvertSvsImages @ARGV");
